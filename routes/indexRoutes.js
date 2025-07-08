const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   console.log('Acessando rota / com sessão:', req.session.userId, req.session.userRole);
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const userRole = req.session.userRole || 'user';
  res.render('index', { userRole });
});

module.exports = router;
