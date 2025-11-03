const db = require('../config/database');
const Usuario = require('../models/usuarioModel');


exports.getAllUsuarios = (req, res) => {
    
    const termo = req.query.search || ''; 
    
    let whereClause = '';
    let params = [];

    if (termo) {
        whereClause = `WHERE u.nome LIKE ?`;
        params.push(`%${termo}%`);
    }

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

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).send('Erro ao buscar usuários');
        }
        
        res.render('usuarios/index', {
            usuarios: results,
            userId: req.session.userId, 
            userRole: req.session.role,
            searchTerm: termo 
        });
    });
};

exports.renderCreateForm = (req, res) => {
  res.render('usuarios/create');
};

exports.renderEditForm = (req, res) => {
    const id = req.params.id;
    let user = {};

    const findUserQuery = 'SELECT username, email FROM users WHERE id = ?';

    db.query(findUserQuery, [id], (errUser, userResults) => {
        if (errUser || userResults.length === 0) {
            console.error('Erro ao buscar dados do user:', errUser);
            return res.status(404).send('Usuário não encontrado ou erro ao buscar dados principais.');
        }

        user = { 
            id: id, 
            username: userResults[0].username, 
            email: userResults[0].email 
        };
        
        Usuario.findById(id, (errPerfil, perfilResults) => {
            if (errPerfil || perfilResults.length === 0) {
                console.error('Erro ao buscar dados do perfil:', errPerfil);
                return res.status(404).send('Dados do perfil (Matrícula, Nome) não encontrados.');
            }

            user.matricula = perfilResults[0].matricula;
            user.nome = perfilResults[0].nome;

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
                
                res.render('usuarios/edit', { user, emprestimo });
            });
        });
    });
};

exports.updateUsuarios = (req, res) => {
    const id = req.params.id;
    const { nome, matricula, email } = req.body;

    const MATRICULA_TAMANHO_ESPERADO = 7; // Corrigido para 7 dígitos
    
    const renderEditPageWithError = (errorMessage) => {
        const fetchUserQuery = `
            SELECT u.*, us.username, us.email 
            FROM usuarios u
            JOIN users us ON u.id = us.id
            WHERE u.id = ?;
        `;

        const fetchEmprestimoQuery = `
            SELECT m.titulo, e.data_devolucao
            FROM emprestimos e
            JOIN material m ON e.n_registro = m.n_registro 
            WHERE e.usuario_id = ? AND LOWER(e.status) = 'autorizado'
        `;

        db.query(fetchUserQuery, [id], (userErr, userResults) => {
            if (userErr || userResults.length === 0) {
                console.error('Erro ao buscar usuário para renderização:', userErr || 'Usuário não encontrado');
                return res.status(500).send('Erro ao recarregar dados do usuário.');
            }
            
            const user = userResults[0];

            db.query(fetchEmprestimoQuery, [id], (empErr, empResults) => {
                
                if (empErr) {
                    console.error('Erro ao buscar empréstimo para renderização:', empErr);
                    empResults = []; 
                }
                
                const emprestimo = empResults.length > 0 ? empResults[0] : null;

                return res.render('usuarios/edit', { 
                    user: user,
                    emprestimo: emprestimo,
                    alerta: errorMessage
                });
            });
        });
    };
    
    // Validação de tamanho agora funciona porque a função renderEditPageWithError está definida acima
    if (matricula.length !== MATRICULA_TAMANHO_ESPERADO) {
        const msg = `O número de matrícula deve ter exatamente ${MATRICULA_TAMANHO_ESPERADO} dígitos.`;
        return renderEditPageWithError(msg); 
    }

    const updateUsuarioQuery = `
        UPDATE usuarios
        SET nome = ?, matricula = ?
        WHERE id = ?
    `;

    const updateUserQuery = `
        UPDATE users
        SET email = ?
        WHERE id = ?
    `;

    db.query(updateUsuarioQuery, [nome, matricula, id], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                const msg = "Já existe um usuário com este número de matrícula.";
                return renderEditPageWithError(msg);
            }
            
            console.error('Erro geral ao atualizar usuário:', err);
            return res.status(500).send('Erro interno do servidor ao atualizar usuário.');
        }

        db.query(updateUserQuery, [email, id], (err) => {
            if (err) {
                console.error('Erro ao atualizar email na tabela "users":', err);
                return res.status(500).send('Erro ao atualizar e-mail do usuário.');
            }

            res.redirect('/usuarios');
        });
    });
};

exports.deleteUsuarios = (req, res) => {
    const userIdToDelete = req.params.id;

    db.beginTransaction(err => {
        if (err) {
            console.error('Erro ao iniciar transação:', err);
            return res.status(500).send('Erro ao excluir usuário.');
        }

        const deleteEmprestimosQuery = 'DELETE FROM emprestimos WHERE usuario_id = ?';
        db.query(deleteEmprestimosQuery, [userIdToDelete], (err) => {
            if (err) return db.rollback(() => {
                console.error('Erro ao deletar empréstimos relacionados:', err);
                return res.status(500).send('Erro ao limpar empréstimos do usuário.');
            });

            const findRoleQuery = 'SELECT role FROM users WHERE id = ?';
            db.query(findRoleQuery, [userIdToDelete], (err, results) => {
                if (err) return db.rollback(() => {
                    console.error('Erro ao buscar role:', err);
                    return res.status(500).send('Erro ao excluir usuário.');
                });

                if (results.length === 0) return db.commit(() => res.redirect('/usuarios'));

                const userRole = results[0].role;
                let deleteProfileQuery = '';

                if (userRole === 'user') {
                    deleteProfileQuery = 'DELETE FROM usuarios WHERE id = ?';
                } else if (userRole === 'admin') {
                    deleteProfileQuery = 'DELETE FROM administradores WHERE id = ?';
                } else {
                    deleteProfileQuery = null; 
                }

                if (deleteProfileQuery) {
                    db.query(deleteProfileQuery, [userIdToDelete], (err) => {
                        if (err) return db.rollback(() => {
                            console.error(`Erro ao deletar perfil:`, err);
                            return res.status(500).send('Erro ao excluir perfil do usuário.');
                        });

                        const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
                        db.query(deleteUserQuery, [userIdToDelete], (err) => {
                            if (err) return db.rollback(() => {
                                console.error('Erro ao deletar de users:', err);
                                return res.status(500).send('Erro ao excluir conta principal.');
                            });

                            db.commit(() => res.redirect('/usuarios'));
                        });
                    });
                } else {
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