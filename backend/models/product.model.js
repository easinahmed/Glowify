const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    stock: { type: Number, default: 20 },
    slug: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Product', productSchema);
