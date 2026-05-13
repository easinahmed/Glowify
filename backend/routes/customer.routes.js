const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats
} = require('../controllers/customer.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');


// Get all customers
router.get('/',protect, authorize('admin'), getAllCustomers);

// Get customer statistics
router.get('/stats', protect, authorize('admin'),  getCustomerStats);

// Get customer by ID
router.get('/:id', protect, authorize('admin'), getCustomerById);

// Create new customer
router.post('/', protect, authorize('admin'), createCustomer);

// Update customer
router.put('/:id', protect, authorize('admin'), updateCustomer);

// Delete customer
router.delete('/:id', protect, authorize('admin'), deleteCustomer);

module.exports = router;