const express = require('express');
const materialController = require('../controllers/materialController'); // vai precisar copiar o controller de produto e renomear pra materialController.js
const router = express.Router();

router.get('/', materialController.getAllMateriais);
router.get('/new', materialController.renderCreateForm);
router.post('/', materialController.createMaterial);
router.get('/:id', materialController.getMaterialById);
router.get('/:id/edit', materialController.renderEditForm);
router.put('/:id', materialController.updateMaterial);
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;
