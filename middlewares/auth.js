exports.setViewLocals = (req, res, next) => {
  res.locals.isLoginPage = req.path === '/login'; 
  res.locals.error = null; 
  next();
};

exports.requerLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.session.userRole === 'admin') {
    return next();
  }
  return res.status(403).render('error', { message: 'Acesso negado: apenas administradores podem cadastrar ou editar livros.' });
};