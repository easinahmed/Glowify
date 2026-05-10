const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== 'admin') {
      const customer = await Customer.findOne({ user: req.user._id });
      if (!customer) {
        return res.status(200).json({ success: true, data: [], count: 0 });
      }
      filter.customer = customer._id;
    }

    const orders = await Order.find(filter)
      .populate('customer', 'name email totalSpent orders status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email totalSpent orders status')
      .populate('items.product', 'name image price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (req.user.role !== 'admin' && order.customer.user?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    if (!customerName || !customerEmail || !items || !totalAmount || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    let customerExists = await Customer.findOne({ user: req.user._id });
    if (!customerExists) {
      const existingCustomerByEmail = await Customer.findOne({ email: customerEmail });
      if (existingCustomerByEmail) {
        customerExists = existingCustomerByEmail;
      } else {
        customerExists = await Customer.create({
          user: req.user._id,
          name: customerName,
          email: customerEmail,
          avatar: `https://i.pravatar.cc/40?u=${customerName.toLowerCase().replace(/\s+/g, '')}`,
          joinDate: new Date(),
          totalSpent: 0,
          orders: 0,
          status: 'Active'
        });
      }
    }

    // Validate products and calculate total
    let calculatedTotal = 0;
    const enrichedItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
      
      calculatedTotal += product.price * item.quantity;

      // Enrich item with product details
      enrichedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order with enriched items
    const order = new Order({
      customer: customerExists._id,
      customerName,
      customerEmail,
      items: enrichedItems,
      totalAmount: calculatedTotal,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      orderNumber: 'GL-' + Date.now().toString().slice(-6)
    });

    await order.save();

    // Update customer stats
    customerExists.orders += 1;
    customerExists.totalSpent += calculatedTotal;
    await customerExists.save();

    // Clear the user's cart after creating an order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalItems: 0, totalPrice: 0 },
      { new: true }
    );

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email totalSpent orders status')
      .populate('items.product', 'name image');

    res.status(201).json({
      success: true,
      data: populatedOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer', 'name email totalSpent orders status');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Update customer stats
    const customer = await Customer.findById(order.customer);
    if (customer) {
      customer.orders -= 1;
      customer.totalSpent -= order.totalAmount;
      await customer.save();
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'PENDING' });
    const shippedOrders = await Order.countDocuments({ status: 'SHIPPED' });
    const deliveredOrders = await Order.countDocuments({ status: 'DELIVERED' });

    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
};