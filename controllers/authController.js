const db = require('../config/database');
const bcrypt = require('bcrypt');

res.render('login', { error: 'Mensagem do erro' });


// Processa o login
exports.login = (req, res) => {
  const { email, senha } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.render('login', { error: 'Erro no servidor.' });
    }

    if (results.length === 0) {
      return res.render('login', { error: 'Email ou senha inválidos.' });
    }

    const user = results[0];
    const senhaCorreta = await bcrypt.compare(senha, user.password);

    if (senhaCorreta) {
      req.session.userId = user.id;
      req.session.userRole = user.role; // "admin" ou "user"
      return res.redirect('/');
    } else {
      return res.render('login', { error: 'Email ou senha inválidos.' });
    }
  });
};

// Renderiza a tela de cadastro
exports.renderRegister = (req, res) => {
  res.render('register', { error: null, isRegisterPage: true });
};

const connection = require('../config/database');

exports.register = async (req, res) => {
  const { username, email, password, role, matricula, cpf, codigo_servidor, nome } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    connection.beginTransaction(async (err) => {
      if (err) throw err;

      const insertUserQuery = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
      connection.query(insertUserQuery, [username, email, passwordHash, role], (err, result) => {
        if (err) {
          connection.rollback(() => {
            return res.render('register', { error: 'Erro ao cadastrar usuário: ' + err.message });
          });
        } else {
          const userId = result.insertId;

          if (role === 'user') {
            const insertUsuario = `INSERT INTO usuarios (id, matricula, nome) VALUES (?, ?, ?)`;
            connection.query(insertUsuario, [userId, matricula, nome], (err2) => {
              if (err2) {
                connection.rollback(() => {
                  return res.render('register', { error: 'Erro ao cadastrar usuário: ' + err2.message });
                });
              } else {
                connection.commit(() => {
                  res.redirect('/login');
                });
              }
            });
          } else if (role === 'admin') {
            const insertAdmin = `INSERT INTO administradores (id, cpf, codigo_servidor, nome) VALUES (?, ?, ?, ?)`;
            connection.query(insertAdmin, [userId, cpf, codigo_servidor, nome], (err2) => {
              if (err2) {
                connection.rollback(() => {
                  return res.render('register', { error: 'Erro ao cadastrar admin: ' + err2.message });
                });
              } else {
                connection.commit(() => {
                  res.redirect('/login');
                });
              }
            });
          }
        }
      });
    });
  } catch (error) {
    res.render('register', { error: 'Erro interno: ' + error.message });
  }
};


// Faz logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
