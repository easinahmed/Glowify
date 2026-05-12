const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();
const { encryptToken } = require('../utils/encryption');


const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });
    const token = signToken(user);

    const encryptedToken = encryptToken(token);

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', encryptedToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user);
    const encryptedToken = encryptToken(token);
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', encryptedToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
  });
  return res.json({ message: 'Logged out' });
};

exports.me = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  res.json({ user: sanitizeUser(req.user) });
};
