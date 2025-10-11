const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { requerLogin } = require('../middlewares/auth');

router.get('/', requerLogin, usuarioController.getAllUsuarios);
router.get('/new', requerLogin, usuarioController.renderCreateForm);
router.get('/:id/edit', requerLogin, usuarioController.renderEditForm);
router.put('/:id', requerLogin, usuarioController.updateUsuarios);
router.delete('/:id', requerLogin, usuarioController.deleteUsuarios);

module.exports = router;
