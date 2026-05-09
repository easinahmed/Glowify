const Customer = require('../models/customer.model');
const User = require('../models/user.model');

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate('user', 'username email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: customers,
      count: customers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: error.message
    });
  }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('user', 'username email role');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customer',
      error: error.message
    });
  }
};

// Create new customer
const createCustomer = async (req, res) => {
  try {
    const { name, email, avatar, joinDate, totalSpent, orders, status, phone, address } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user first
    const user = new User({
      username: name.toLowerCase().replace(/\s+/g, '_'),
      email,
      password: 'defaultpassword123', // This should be changed by the user
      role: 'user'
    });

    await user.save();

    // Create customer
    const customer = new Customer({
      user: user._id,
      name,
      email,
      avatar: avatar || `https://i.pravatar.cc/40?u=${name.toLowerCase().replace(/\s+/g, '')}`,
      joinDate: joinDate || new Date(),
      totalSpent: totalSpent || 0,
      orders: orders || 0,
      status: status || 'Active',
      phone: phone || '',
      address: address || {}
    });

    await customer.save();

    const populatedCustomer = await Customer.findById(customer._id)
      .populate('user', 'username email role');

    res.status(201).json({
      success: true,
      data: populatedCustomer,
      message: 'Customer created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating customer',
      error: error.message
    });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const { name, email, avatar, joinDate, totalSpent, orders, status, phone, address } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        avatar,
        joinDate,
        totalSpent,
        orders,
        status,
        phone,
        address
      },
      { new: true }
    ).populate('user', 'username email role');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update associated user email if changed
    if (email && email !== customer.user.email) {
      await User.findByIdAndUpdate(customer.user._id, { email });
    }

    res.status(200).json({
      success: true,
      data: customer,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating customer',
      error: error.message
    });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Delete associated user
    await User.findByIdAndDelete(customer.user);

    // Delete customer
    await Customer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting customer',
      error: error.message
    });
  }
};

// Get customer statistics
const getCustomerStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const activeCustomers = await Customer.countDocuments({ status: 'Active' });
    const inactiveCustomers = await Customer.countDocuments({ status: 'Inactive' });

    const newThisMonth = await Customer.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    const avgLifetimeValue = await Customer.aggregate([
      { $group: { _id: null, avg: { $avg: '$totalSpent' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        newThisMonth,
        avgLifetimeValue: avgLifetimeValue[0]?.avg || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customer statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats
};