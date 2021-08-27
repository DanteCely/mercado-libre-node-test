/**
 * Ruta: /api/usuarios
 */

const { Router } = require('express');

const { getProductList, getItem } = require('../controllers/items.controller');

const router = Router();

router.get('/', getProductList);
router.get('/:id', getItem);

module.exports = router;
