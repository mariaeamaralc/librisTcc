const db = require('../config/database');
const Usuario = require('../models/usuarioModel');

// Listar todos os usuários (com ou sem filtro de busca)
exports.getAllUsuarios = (req, res) => {
    // 1. Pega o termo de busca da query string (ex: /usuarios?search=joao)
    // Se não houver termo, 'termo' será uma string vazia ('').
    const termo = req.query.search || ''; 
    
    // 2. Define as cláusulas WHERE e os parâmetros para o SQL
    let whereClause = '';
    let params = [];

    if (termo) {
        // Se houver termo, adicionamos a cláusula WHERE e o parâmetro com o curinga
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
                WHEN COUNT(e.id) > 0 THEN 'Sim' 
                ELSE 'Não' 
            END AS possuiEmprestimo
        FROM usuarios u
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
            userRole: req.session.role,
            // Adiciona o termo de busca atual para preencher o input do frontend
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

  Usuario.findById(id, (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).send('Erro ao buscar usuário');
    }

    const user = results[0]; // pega o objeto do array retornado pelo db.query

    const queryEmprestimo = `
      SELECT m.titulo, e.data_devolucao
      FROM emprestimos e
      JOIN material m ON e.n_registro = m.n_registro
      WHERE e.usuario_id = ? AND e.status = 'ativo'
      LIMIT 1
    `;

    db.query(queryEmprestimo, [id], (err, result) => {
      if (err) {
        console.error('Erro ao buscar empréstimo:', err);
        return res.render('usuarios/edit', { user, emprestimo: null });
      }

      const emprestimo = result.length > 0 ? result[0] : null;
      res.render('usuarios/edit', { user, emprestimo });
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

// Excluir usuário
exports.deleteUsuarios = (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM usuarios WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) {
      console.error('Erro ao excluir usuário:', err);
      return res.status(500).send('Erro ao excluir usuário');
    }
    res.redirect('/usuarios');
  });
};
