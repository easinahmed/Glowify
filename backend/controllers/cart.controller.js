const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Get user's cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name image price stock');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    const desiredQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (product.stock < desiredQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    if (existingItem) {
      existingItem.quantity = desiredQuantity;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name image price stock');

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Item added to cart'
    });
  } catch (error) {
    console.error('addToCart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message,
      stack: error.stack
    });
  }
};

// Update cart item
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return removeFromCart(req, res);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not in cart'
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name image price stock');

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Cart updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product', 'name image price stock');

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Item removed from cart'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalItems: 0, totalPrice: 0 },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Cart cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};