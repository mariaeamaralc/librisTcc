const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');
const { requerLogin, isAdmin } = require('../middlewares/auth');

router.post('/solicitar', requerLogin, emprestimoController.solicitarEmprestimo);
router.post('/autorizar/:id', requerLogin, isAdmin, emprestimoController.autorizarEmprestimo);
router.post('/recusar/:id', requerLogin, isAdmin, emprestimoController.recusarEmprestimo);
router.post('/receber/:id', requerLogin, isAdmin, emprestimoController.receberDevolucao);
router.post('/emprestimo/renovar', requerLogin, emprestimoController.renovarEmprestimo); 

router.get('/meu-emprestimo', emprestimoController.getEmprestimoAtivo);
router.get('/dashboard', requerLogin, isAdmin, emprestimoController.dashboardAdmin)

module.exports = router;
