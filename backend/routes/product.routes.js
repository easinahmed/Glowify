const router = require('express').Router();
const {
  getProducts,
  getProductById,
  getCategories,
  seedProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

router.get('/seed', seedProducts);
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
