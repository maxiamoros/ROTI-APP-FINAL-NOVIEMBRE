const express = require('express');
const { getVentas, createVenta, updateEstadoVenta } = require('../controllers/ventas.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getVentas);
router.post('/', createVenta); // Se puede llamar desde Portal (sin token) o Caja (con token)
router.patch('/:id', verifyToken, updateEstadoVenta);

module.exports = router;
