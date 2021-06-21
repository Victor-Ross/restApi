const express = require('express');
const router = express.Router();

const pedidosController = require('../controllers/pedidosController');


router.get('/', pedidosController.getPedidos);
router.post('/', pedidosController.postPedidos);
router.get('/:id_pedido', pedidosController.getUmPedido);
router.delete('/', pedidosController.removePedido);


module.exports = router;