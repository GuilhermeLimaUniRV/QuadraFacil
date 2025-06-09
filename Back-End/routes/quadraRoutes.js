const express = require('express');
const router = express.Router();
const controller = require('../controllers/quadraController');

router.post('/', controller.criarQuadra);
router.get('/', controller.listarQuadras);
router.get('/:id', controller.buscarQuadraPorId);
router.put('/:id', controller.atualizarQuadra);
router.delete('/:id', controller.deletarQuadra);

module.exports = router;
