const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth.middleware');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
} = require('../controllers/order.controller');

// Create new order (authenticated users)
router.post('/', protect, createOrder);

// Get order statistics (admin only)
router.get('/stats', protect, authorize('admin'), getOrderStats);

// Get all orders (admin sees all; users see own orders)
router.get('/', protect, getAllOrders);

// Get order by ID
router.get('/:id', protect, getOrderById);

// Update order status (admin only)
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

// Delete order (admin only)
router.delete('/:id', protect, authorize('admin'), deleteOrder);

module.exports = router;