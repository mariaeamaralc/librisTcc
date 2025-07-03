exports.renderLogin = (req, res) => {
  res.render('login', { error: null });  
};

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
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (senhaCorreta) {
      req.session.userId = user.id;
      return res.redirect('/');
    } else {
      return res.render('login', { error: 'Email ou senha inválidos.' });
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
