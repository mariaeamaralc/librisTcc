const db = require('../config/database');
const connection = require('../config/database');
// Listar todos os usuários
exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send('Erro ao buscar usuários');
    res.render('index', { users: results });
  });
};

// Buscar usuários (rota /search?nome=...)
exports.searchUsers = (req, res) => {
  const search = req.query.search || '';  // pega o que vem do input de busca
  const sql = 'SELECT * FROM users WHERE username LIKE ?';
  db.query(sql, [`%${search}%`], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro na busca' });
    res.json({ users: results });  // responde com JSON que seu fetch vai usar
  });
};


// Renderiza formulário de criação
exports.renderCreateForm = (req, res) => {
  res.render('create');
};

// Criar novo usuário
exports.createUser = (req, res) => {
  const { nome, email, idade } = req.body;
  const sql = 'INSERT INTO users (username, email, idade, password) VALUES (?, ?, ?)';
  db.query(sql, [nome, email, idade], (err) => {
    if (err) return res.status(500).send('Erro ao criar usuário');
    res.redirect('/');
  });
};

// Buscar usuário por ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).send('Usuário não encontrado');
    res.render('show', { user: results[0] });
  });
};

// Renderiza formulário de edição
exports.renderEditForm = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).send('Usuário não encontrado');
    res.render('edit', { user: results[0] });
  });
};

// Atualizar usuário
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { nome, email, idade } = req.body;
  const sql = 'UPDATE users SET nome = ?, email = ?, idade = ? WHERE id = ?';
  db.query(sql, [nome, email, idade, id], (err) => {
    if (err) return res.status(500).send('Erro ao atualizar usuário');
    res.redirect('/');
  });
};

// Excluir usuário
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).send('Erro ao deletar usuário');
    res.redirect('/');
  });
};
