
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
