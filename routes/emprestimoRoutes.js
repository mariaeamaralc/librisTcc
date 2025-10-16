const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');
const { requerLogin, isAdmin } = require('../middlewares/auth');

// fluxo de empréstimo
router.post('/solicitar', requerLogin, emprestimoController.solicitarEmprestimo);

// dashboard admin
router.get('/dashboard', requerLogin, isAdmin, emprestimoController.dashboardAdmin);

// ações sobre empréstimos
router.post('/autorizar/:id', requerLogin, isAdmin, emprestimoController.autorizarEmprestimo);
router.post('/recusar/:id', requerLogin, isAdmin, emprestimoController.recusarEmprestimo);
router.post('/receber/:id', requerLogin, isAdmin, emprestimoController.receberDevolucao);

//renovação de empréstimos
router.post('/emprestimo/renovar', requerLogin, emprestimoController.renovarEmprestimo); 
router.get('/meu-emprestimo', emprestimoController.getEmprestimoAtivo)
module.exports = router;
