const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const upload = require('../middlewares/upload');
const { isAdmin } = require('../middlewares/auth');

// 🔍 Rotas de visualização
router.get('/', materialController.listarMateriais); // ✅ filtro por categoria
router.get('/pesquisar', materialController.renderPesquisarAcervo); // ✅ busca por n_registro
router.get('/registrar', materialController.renderRegistrarMaterial);
router.get('/:n_registro/edit', materialController.renderEditForm);
router.get('/:n_registro', materialController.verMaterial);

// 📝 Rotas de ação
router.post('/registrar', isAdmin, upload.single('foto'), materialController.registrarMaterial);
router.put('/:n_registro', isAdmin, upload.single('foto'), materialController.updateMaterial);   
router.post('/:n_registro/delete', isAdmin, materialController.excluirMaterial);   
module.exports = router;