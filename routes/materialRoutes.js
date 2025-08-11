const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

router.get('/pesquisar', materialController.renderPesquisarAcervo);
router.get('/registrar', materialController.renderRegistrarMaterial);
router.post('/registrar', materialController.registrarMaterial);
router.post('/:n_registro/delete', materialController.excluirMaterial);
router.get('/:n_registro/edit', materialController.renderEditForm);
router.put('/:n_registro', materialController.updateMaterial);
router.get('/:n_registro', materialController.verMaterial);
module.exports = router;
