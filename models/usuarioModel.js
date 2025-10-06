const db = require('../config/database');

const Usuario = {
  // Listar todos os usuários com flag de empréstimo
  getAll: (callback) => {
    const query = `
      SELECT u.id, u.matricula, u.nome, u.email,
             CASE WHEN COUNT(e.id) > 0 THEN 'Sim' ELSE 'Não' END AS possuiEmprestimo
      FROM usuarios u
      LEFT JOIN emprestimos e ON e.usuario_id = u.id
      GROUP BY u.id, u.matricula, u.nome, u.email
    `;
    db.query(query, callback);
  },

  // Buscar usuários por nome
  search: (nome, callback) => {
    const query = `
      SELECT u.id, u.matricula, u.nome, u.email,
             CASE WHEN COUNT(e.id) > 0 THEN 'Sim' ELSE 'Não' END AS possuiEmprestimo
      FROM usuarios u
      LEFT JOIN emprestimos e ON e.usuario_id = u.id
      WHERE u.nome LIKE ?
      GROUP BY u.id, u.matricula, u.nome, u.email
    `;
    db.query(query, [`%${nome}%`], callback);
  },

  // Buscar usuário por ID
  findById: (id, callback) => {
    db.query('SELECT * FROM usuarios WHERE id = ?', [id], callback);
  },

  // Criar usuário
  create: (usuario, callback) => {
    const sql = 'INSERT INTO usuarios (matricula, nome, email, senha) VALUES (?, ?, ?, ?)';
    db.query(sql, [usuario.matricula, usuario.nome, usuario.email, usuario.senha], callback);
  },

  // Atualizar usuário
  update: (id, usuario, callback) => {
    const sql = 'UPDATE usuarios SET matricula = ?, nome = ?, email = ?, senha = ? WHERE id = ?';
    db.query(sql, [usuario.matricula, usuario.nome, usuario.email, usuario.senha, id], callback);
  },

  // Deletar usuário
  delete: (id, callback) => {
    db.query('DELETE FROM usuarios WHERE id = ?', [id], callback);
  }
};

module.exports = Usuario;
