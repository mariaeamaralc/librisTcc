const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

router.get('/pesquisar', materialController.renderPesquisarAcervo);
router.get('/registrar', materialController.renderRegistrarMaterial);
router.post('/registrar', materialController.registrarMaterial);
router.post('/material/:n_registro/delete', materialController.excluirMaterial);

module.exports = router;
