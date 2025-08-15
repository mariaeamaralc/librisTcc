const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const upload = require('../middlewares/upload');

// 🔍 Rotas de visualização
router.get('/', materialController.listarMateriais); // ✅ filtro por categoria
router.get('/pesquisar', materialController.renderPesquisarAcervo); // ✅ busca por n_registro
router.get('/registrar', materialController.renderRegistrarMaterial);
router.get('/:n_registro/edit', materialController.renderEditForm);
router.get('/:n_registro', materialController.verMaterial);

// 📝 Rotas de ação
router.post('/registrar', upload.single('foto'), materialController.registrarMaterial);
router.put('/:n_registro', upload.single('foto'), materialController.updateMaterial);
router.post('/:n_registro/delete', materialController.excluirMaterial);

module.exports = router;