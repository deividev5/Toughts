const express = require('express');
const router = express.Router();

// Controller responsável pela autenticação
const AuthController = require('../controllers/AuthController');

// Rota para exibir o formulário de login
router.get('/login', AuthController.login);

// Rota para processar o login do usuário
router.post('/login', AuthController.loginPost);

// Rota para exibir o formulário de registro
router.get('/register', AuthController.register);

// Rota para processar o registro do usuário
router.post('/register', AuthController.registerPost);

// Rota para fazer logout (encerra a sessão)
router.get('/logout', AuthController.logout);

module.exports = router;
