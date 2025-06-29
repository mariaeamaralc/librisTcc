const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requerLogin } = require('../middlewares/auth');

router.get('/', requerLogin, userController.getAllUsers);
router.get('/search', requerLogin, userController.searchUsers);
router.get('/new', requerLogin, userController.renderCreateForm);
router.post('/', requerLogin, userController.createUser);
router.get('/:id', requerLogin, userController.getUserById);
router.get('/:id/edit', requerLogin, userController.renderEditForm);
router.put('/:id', requerLogin, userController.updateUser);
router.delete('/:id', requerLogin, userController.deleteUser);

module.exports = router;
