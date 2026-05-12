const router = require('express').Router();
const {
  getProducts,
  getProductById,
  getCategories,
  getBestSellers,
  seedProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

router.get('/seed', seedProducts);
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/best-sellers', getBestSellers);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
