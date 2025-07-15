const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

router.get('/pesquisar', materialController.renderPesquisarAcervo);
router.get('/registrar', materialController.renderRegistrarMaterial);
router.post('/registrar', materialController.registrarMaterial);

module.exports = router;
