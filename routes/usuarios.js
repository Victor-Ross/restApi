const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/usuariosController');


router.post('/cadastro', usuariosController.cadastrarUsuario);
router.post('/login', usuariosController.loginUsuario);

module.exports = router;