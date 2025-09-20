const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');
const { requerLogin } = require('../middlewares/auth');

router.post('/solicitar', requerLogin, emprestimoController.solicitarEmprestimo);
router.get('/pendentes', requerLogin, emprestimoController.listarPendentes); // Para admin autorizar

router.post('/:id/autorizar', requerLogin, emprestimoController.autorizarEmprestimo);

module.exports = router;