const express = require('express');
const router = express.Router();

// Controller responsável pelos pensamentos
const ToughtController = require('../controllers/ToughtController');

// Middleware para verificar se o usuário está autenticado
const checkAuth = require('../helpers/auth').checkAuth;

// Página para criar novo pensamento
router.get('/add', checkAuth, ToughtController.createTought);

// Salva o pensamento criado
router.post('/add', checkAuth, ToughtController.createToughtSave);

// Página para editar pensamento existente
router.get('/edit/:id', checkAuth, ToughtController.updateTought);

// Atualiza pensamento no banco de dados
router.post('/edit', checkAuth, ToughtController.updateToughtSave);

// Dashboard do usuário com seus pensamentos
router.get('/dashboard', checkAuth, ToughtController.dashboard);

// Remove pensamento do banco de dados
router.post('/remove', checkAuth, ToughtController.removeTought);

// Página principal com todos os pensamentos (pública)
router.get('/', ToughtController.showToughts);

module.exports = router;
