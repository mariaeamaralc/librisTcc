const db = require('../config/database');
const bcrypt = require('bcrypt');

// Renderiza a tela de login SEM erro
exports.renderLogin = (req, res) => {
  res.render('login', { error: null });
};

// Login com tratamento de erro
exports.login = (req, res) => {
  const { email, senha } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err) return res.render('login', { error: 'Erro no servidor.' });

    if (results.length === 0) {
      return res.render('login', { error: 'Email ou senha inválidos.' });
    }

    const user = results[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (senhaCorreta) {
      req.session.userId = user.id;
      res.redirect('/');
    } else {
      res.render('login', { error: 'Email ou senha inválidos.' });
    }
  });
};

// Renderiza a tela de cadastro
exports.renderRegister = (req, res) => {
  res.render('register');
};

// Cadastro de usuário com hash de senha
exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const hash = await bcrypt.hash(senha, 10);
    const sql = 'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)';
    db.query(sql, [nome, email, hash], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao cadastrar usuário');
      }
      res.redirect('/login');
    });
  } catch {
    res.status(500).send('Erro interno');
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
