const db = require('../config/database');
const Usuario = require('../models/usuarioModel');

// Listar todos os usuários (com ou sem filtro de busca)
exports.getAllUsuarios = (req, res) => {
    // 1. Pega o termo de busca da query string (ex: /usuarios?search=joao)
    const termo = req.query.search || ''; 
    
    // 2. Define as cláusulas WHERE e os parâmetros para o SQL
    let whereClause = '';
    let params = [];

    if (termo) {
        whereClause = `WHERE u.nome LIKE ?`;
        params.push(`%${termo}%`);
    }

    // 3. Monta a query SQL dinamicamente
    const query = `
        SELECT 
            u.id, 
            u.matricula, 
            u.nome, 
            u.email,
            CASE 
                -- CORREÇÃO AQUI: Conta apenas se o status for 'pendente' ou 'autorizado'
                WHEN COUNT(CASE WHEN e.status IN ('pendente', 'autorizado') THEN 1 ELSE NULL END) > 0 
                THEN 'Sim' 
                ELSE 'Não' 
            END AS possuiEmprestimo
        FROM usuarios u
        -- Adicionamos a condição de status no JOIN para filtrar o que será contado
        LEFT JOIN emprestimos e ON e.usuario_id = u.id 
        ${whereClause} 
        GROUP BY u.id, u.matricula, u.nome, u.email
        ORDER BY u.nome 
    `;

    // 4. Executa a query com os parâmetros corretos (se houver)
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).send('Erro ao buscar usuários');
        }
        
        // 5. Renderiza a view, passando o termo de busca de volta para o input
        res.render('usuarios/index', {
            usuarios: results,
            userId: req.session.userId, 
            userRole: req.session.role,
            searchTerm: termo 
        });
    });
};
// Renderizar formulário de criação
exports.renderCreateForm = (req, res) => {
  res.render('usuarios/create');
};

// Renderizar formulário de edição + empréstimo ativo
exports.renderEditForm = (req, res) => {
    const id = req.params.id;
    let user = {};

    // 1. Busca os dados de login/email na tabela principal 'users'
    const findUserQuery = 'SELECT username, email FROM users WHERE id = ?';

    db.query(findUserQuery, [id], (errUser, userResults) => {
        if (errUser || userResults.length === 0) {
            console.error('Erro ao buscar dados do user:', errUser);
            return res.status(404).send('Usuário não encontrado ou erro ao buscar dados principais.');
        }

        // Combina o ID, email e username
        user = { 
            id: id, 
            username: userResults[0].username, 
            email: userResults[0].email 
        };
        
        // 2. Busca os dados do perfil (matrícula, nome) na tabela 'usuarios'
        Usuario.findById(id, (errPerfil, perfilResults) => {
            if (errPerfil || perfilResults.length === 0) {
                // Se o perfil não for encontrado, tratamos como erro 404 (embora o 'user' exista)
                console.error('Erro ao buscar dados do perfil:', errPerfil);
                return res.status(404).send('Dados do perfil (Matrícula, Nome) não encontrados.');
            }

            // Adiciona Matrícula e Nome ao objeto user
            user.matricula = perfilResults[0].matricula;
            user.nome = perfilResults[0].nome;

          // 3. Busca o empréstimo ativo
            const queryEmprestimo = `
                SELECT m.titulo, e.data_devolucao
                FROM emprestimos e
                JOIN material m ON e.n_registro = m.n_registro
                -- MUDANÇA AQUI: Buscando status 'autorizado'
                WHERE e.usuario_id = ? AND LOWER(e.status) = 'autorizado'
                LIMIT 1
            `;

            db.query(queryEmprestimo, [id], (errEmprestimo, resultEmprestimo) => {
                if (errEmprestimo) {
                    console.error('Erro ao buscar empréstimo:', errEmprestimo);
                    const emprestimo = null; 
                    return res.render('usuarios/edit', { user, emprestimo });
                }
                
                const emprestimo = (resultEmprestimo && resultEmprestimo.length > 0) ? resultEmprestimo[0] : null;
                
                // 4. Renderiza a view com TODOS os dados
                res.render('usuarios/edit', { user, emprestimo });
            });
        });
    });
};

// Atualizar usuário
exports.updateUsuarios = (req, res) => {
  const id = req.params.id;
  const { nome, matricula, email } = req.body;

  const query = `
    UPDATE usuarios
    SET nome = ?, matricula = ?, email = ?
    WHERE id = ?
  `;

  db.query(query, [nome, matricula, email, id], (err) => {
    if (err) {
      console.error('Erro ao atualizar usuário:', err);
      return res.status(500).send('Erro ao atualizar usuário');
    }
    res.redirect('/usuarios');
  });
};

// Excluir usuário (AGORA COMPLETO E SEGURO)
// Excluir usuário (AGORA COMPLETO E SEGURO)
exports.deleteUsuarios = (req, res) => {
    const userIdToDelete = req.params.id;

    // 1. Inicia a Transação
    db.beginTransaction(err => {
        if (err) {
            console.error('Erro ao iniciar transação:', err);
            return res.status(500).send('Erro ao excluir usuário.');
        }

        // 2. CORREÇÃO CRUCIAL: Deleta todos os empréstimos (pendentes, ativos, devolvidos, etc.)
        // relacionados a este usuário para evitar o erro de Foreign Key.
        const deleteEmprestimosQuery = 'DELETE FROM emprestimos WHERE usuario_id = ?';
        db.query(deleteEmprestimosQuery, [userIdToDelete], (err) => {
            if (err) return db.rollback(() => {
                console.error('Erro ao deletar empréstimos relacionados:', err);
                return res.status(500).send('Erro ao limpar empréstimos do usuário.');
            });

            // 3. Query para obter a role do usuário (antigo passo 2)
            const findRoleQuery = 'SELECT role FROM users WHERE id = ?';
            db.query(findRoleQuery, [userIdToDelete], (err, results) => {
                if (err) return db.rollback(() => {
                    console.error('Erro ao buscar role:', err);
                    return res.status(500).send('Erro ao excluir usuário.');
                });

                if (results.length === 0) return db.commit(() => res.redirect('/usuarios'));

                const userRole = results[0].role;
                let deleteProfileQuery = '';

                // 4. Define qual tabela de perfil deletar (antigo passo 3)
                if (userRole === 'user') {
                    deleteProfileQuery = 'DELETE FROM usuarios WHERE id = ?';
                } else if (userRole === 'admin') {
                    deleteProfileQuery = 'DELETE FROM administradores WHERE id = ?';
                } else {
                    deleteProfileQuery = null; 
                }

                // 5. Deleta o Perfil (se a role for válida - antigo passo 4)
                if (deleteProfileQuery) {
                    db.query(deleteProfileQuery, [userIdToDelete], (err) => {
                        if (err) return db.rollback(() => {
                            console.error(`Erro ao deletar perfil:`, err);
                            return res.status(500).send('Erro ao excluir perfil do usuário.');
                        });

                        // 6. Deleta o registro principal (da tabela users - antigo passo 5)
                        const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
                        db.query(deleteUserQuery, [userIdToDelete], (err) => {
                            if (err) return db.rollback(() => {
                                console.error('Erro ao deletar de users:', err);
                                return res.status(500).send('Erro ao excluir conta principal.');
                            });

                            // 7. Confirma (Commit) a transação (antigo passo 6)
                            db.commit(() => res.redirect('/usuarios'));
                        });
                    });
                } else {
                    // Se o perfil não foi deletado (role desconhecida), tenta deletar só o users
                    const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
                    db.query(deleteUserQuery, [userIdToDelete], (err) => {
                        if (err) return db.rollback(() => {
                            console.error('Erro ao deletar de users:', err);
                            return res.status(500).send('Erro ao excluir conta principal.');
                        });

                        db.commit(() => res.redirect('/usuarios'));
                    });
                }
            });
        });
    });
};