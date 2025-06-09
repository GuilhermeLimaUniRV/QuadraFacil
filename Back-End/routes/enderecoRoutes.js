const express = require('express');
const router = express.Router();
const controller = require('../controllers/enderecoController');

router.post('/', controller.criarEndereco);
router.get('/', controller.listarEnderecos);
router.get('/:id', controller.buscarEnderecoPorId);
router.put('/:id', controller.atualizarEndereco);
router.delete('/:id', controller.deletarEndereco);

module.exports = router;
