const db = require('../config/database');
const bcrypt = require('bcrypt');

// Renderiza tela de login
exports.renderLogin = (req, res) => {
  res.render('login', { error: null, isLoginPage: true });
};

// Processa login
exports.login = (req, res) => {
  const { email, senha } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Erro no login:', err);
      return res.render('login', { error: 'Erro no servidor.' });
    }

    if (results.length === 0) {
      return res.render('login', { error: 'Email ou senha inválidos.' });
    }

    const user = results[0];
    const senhaCorreta = await bcrypt.compare(senha, user.password);

    if (!senhaCorreta) {
      return res.render('login', { error: 'Email ou senha inválidos.' });
    }

    // Sessão salva com dados corretos
    req.session.userId = user.id;     // ID de users (referenciado em usuarios/admins)
    req.session.userRole = user.role; // "user" ou "admin"
    req.session.userNome = user.username;

    console.log('Recebido login:', email, senha);
    console.log('Login bem-sucedido:', user.username, '-', user.role);
    console.log(`Sessão -> userId=${req.session.userId}, role=${req.session.userRole}`);

    // Redireciona conforme o tipo
    if (user.role === 'admin') {
      return res.redirect('/');
    } else {
      return res.redirect('/material/pesquisar');
    }
  });
};

// Renderiza tela de cadastro
exports.renderRegister = (req, res) => {
  res.render('register', { error: null, isRegisterPage: true });
};

// Processa cadastro
exports.register = async (req, res) => {
  const { username, email, password, role, matricula, cpf, codigo_servidor, nome } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    db.beginTransaction((err) => {
      if (err) throw err;

      const insertUserQuery = `
        INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)
      `;

      db.query(insertUserQuery, [username, email, passwordHash, role], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.render('register', { error: 'Erro ao cadastrar usuário: ' + err.message });
          });
        }

        const userId = result.insertId; // ID da tabela users

        if (role === 'user') {
          const insertUsuario = `
            INSERT INTO usuarios (id, matricula, nome) VALUES (?, ?, ?)
          `;
          db.query(insertUsuario, [userId, matricula, nome], (err2) => {
            if (err2) {
              return db.rollback(() => {
                res.render('register', { error: 'Erro ao cadastrar usuário: ' + err2.message });
              });
            }
            db.commit(() => res.redirect('/login'));
          });
        } else if (role === 'admin') {
          const insertAdmin = `
            INSERT INTO administradores (id, cpf, codigo_servidor, nome) VALUES (?, ?, ?, ?)
          `;
          db.query(insertAdmin, [userId, cpf, codigo_servidor, nome], (err2) => {
            if (err2) {
              return db.rollback(() => {
                res.render('register', { error: 'Erro ao cadastrar admin: ' + err2.message });
              });
            }
            db.commit(() => res.redirect('/login'));
          });
        } else {
          db.rollback(() => {
            res.render('register', { error: 'Tipo de usuário inválido.' });
          });
        }
      });
    });
  } catch (error) {
    console.error('Erro interno no cadastro:', error);
    res.render('register', { error: 'Erro interno: ' + error.message });
  }
};

// Faz logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
