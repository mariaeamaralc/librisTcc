const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Mostra o formulário de login
router.get('/login', authController.renderLogin);

// Processa o login
router.post('/login', authController.login);

// Faz logout
router.get('/logout', authController.logout);

module.exports = router;
