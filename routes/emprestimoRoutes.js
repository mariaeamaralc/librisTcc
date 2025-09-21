const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');
const { requerLogin, isAdmin } = require('../middlewares/auth');

// Usuário solicita empréstimo
router.post('/solicitar', requerLogin, emprestimoController.solicitarEmprestimo);

// Admin vê solicitações pendentes
router.get('/pendentes', requerLogin, isAdmin, emprestimoController.listarPendentes);

// Admin autoriza empréstimo
router.post('/:id/autorizar', requerLogin, isAdmin, emprestimoController.autorizarEmprestimo);

// Admin recusa empréstimo
router.post('/:id/recusar', requerLogin, isAdmin, emprestimoController.recusarEmprestimo);

module.exports = router;