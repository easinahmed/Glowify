const { Schema, model } = require('mongoose');

const customerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, default: '' },
    joinDate: { type: Date, default: Date.now },
    totalSpent: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    phone: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: 'USA' }
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model('Customer', customerSchema);