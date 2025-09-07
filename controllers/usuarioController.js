const db = require('../config/database');

// Listar todos os usuários
exports.getAllUsuarios = (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return res.status(500).send('Erro ao buscar usuários');
    res.render('usuarios/index', { usuarios: results, userRole: req.session.userRole });
  });
};

// Buscar usuários por nome
exports.searchUsuarios = (req, res) => {
  const search = req.query.search || '';
  db.query('SELECT * FROM usuarios WHERE nome LIKE ?', [`%${search}%`], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro na busca' });
    res.json({ usuarios: results, userRole: req.session.userRole });
  });
};

// Renderiza formulário de criação
exports.renderCreateForm = (req, res) => {
  res.render('usuarios/create', { userRole: req.session.userRole });
};

// Buscar usuário por ID
exports.getUsuariosById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).send('Usuário não encontrado');
    res.render('usuarios/show', { user: results[0], userRole: req.session.userRole });
  });
};

// Renderiza formulário de edição
exports.renderEditForm = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).send('Usuário não encontrado');
    res.render('usuarios/edit', { user: results[0], userRole: req.session.userRole });
  });
};

// Atualizar usuário
exports.updateUsuarios = (req, res) => {
  const { id } = req.params;
  const { matricula, nome, email, idade, senha, role } = req.body;
  const sql = 'UPDATE usuarios SET matricula = ?, nome = ?, email = ?, idade = ?, senha = ?, role = ? WHERE id = ?';
  db.query(sql, [matricula, nome, email, idade, senha, role, id], (err) => {
    if (err) return res.status(500).send('Erro ao atualizar usuário');
    res.redirect('/usuarios');
  });
};

// Excluir usuário
exports.deleteUsuarios = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send('Erro ao deletar usuário');
    res.redirect('/usuarios');
  });
};