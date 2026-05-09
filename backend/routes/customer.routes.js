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

// Get all customers
router.get('/', getAllCustomers);

// Get customer statistics
router.get('/stats', getCustomerStats);

// Get customer by ID
router.get('/:id', getCustomerById);

// Create new customer
router.post('/', createCustomer);

// Update customer
router.put('/:id', updateCustomer);

// Delete customer
router.delete('/:id', deleteCustomer);

module.exports = router;