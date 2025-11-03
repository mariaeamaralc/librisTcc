const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/logout', authController.logout);
router.get('/register', authController.renderRegister);  
router.get('/login', authController.renderLogin)
    
router.post('/register', authController.register);   
router.post('/login', authController.login);

module.exports = router;
