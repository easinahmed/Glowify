const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
} = require('../controllers/order.controller');

// Get all orders
router.get('/', getAllOrders);

// Get order statistics
router.get('/stats', getOrderStats);

// Get order by ID
router.get('/:id', getOrderById);

// Create new order
router.post('/', createOrder);

// Update order status
router.put('/:id/status', updateOrderStatus);

// Delete order
router.delete('/:id', deleteOrder);

module.exports = router;