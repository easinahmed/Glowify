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
const { protect } = require('../middlewares/auth.middleware');

router.get('/seed', seedProducts);
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/best-sellers', getBestSellers);
router.get('/:id', getProductById);
router.post('/', protect, authorize('admin'), addProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
