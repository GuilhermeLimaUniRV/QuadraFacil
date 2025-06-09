const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservaController');

router.post('/', controller.criarReserva);
router.get('/', controller.listarReservas);
router.get('/:id', controller.buscarReservaPorId);
router.get('/usuario/:id_usuario', controller.listarPorUsuario);
router.delete('/:id', controller.deletarReserva);

module.exports = router;
