const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');

router.post('/', controller.criarUsuario);
router.get('/', controller.listarUsuarios);
router.get('/:id', controller.buscarUsuarioPorId);
router.put('/:id', controller.atualizarUsuario);
router.delete('/:id', controller.deletarUsuario);
router.post('/login', controller.loginUsuario);

module.exports = router;
