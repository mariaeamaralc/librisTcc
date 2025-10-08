const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');
const { requerLogin, isAdmin } = require('../middlewares/auth');

// Fluxo de empréstimo
router.post('/solicitar', requerLogin, emprestimoController.solicitarEmprestimo);

// Dashboard admin
router.get('/dashboard', requerLogin, isAdmin, emprestimoController.dashboardAdmin);

// Ações sobre empréstimos
router.post('/autorizar/:id', requerLogin, isAdmin, emprestimoController.autorizarEmprestimo);
router.post('/recusar/:id', requerLogin, isAdmin, emprestimoController.recusarEmprestimo);
router.post('/:id/receber', requerLogin, isAdmin, emprestimoController.receberDevolucao);

module.exports = router;
