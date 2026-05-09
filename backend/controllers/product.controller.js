const Product = require('../models/product.model');

const SAMPLE_PRODUCTS = [
  {
    name: 'Midnight Renewal Oil',
    description: 'A silky serum formulated to restore radiance and calm skin.',
    category: 'SERUM',
    price: 68,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
    stock: 24,
    slug: 'midnight-renewal-oil',
  },
  {
    name: 'Velvet Cloud Cream',
    description: 'A rich moisturizer that replenishes and smooths skin.',
    category: 'MOISTURIZER',
    price: 52,
    image: 'https://images.unsplash.com/photo-1620916566398-39f5a9dbab7be?w=600&q=80',
    stock: 14,
    slug: 'velvet-cloud-cream',
  },
  {
    name: 'Gentle Botanicals Milk',
    description: 'A soft cleanser designed for sensitive and dry skin.',
    category: 'CLEANSER',
    price: 45,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
    stock: 18,
    slug: 'gentle-botanicals-milk',
  },
  {
    name: 'Aura Glow Elixir',
    description: 'A brightening serum that leaves skin glowing.',
    category: 'SERUM',
    price: 82,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&q=80',
    stock: 10,
    slug: 'aura-glow-elixir',
  },
  {
    name: 'Earthbound Clay Mask',
    description: 'A purifying ritual to detoxify and refine skin texture.',
    category: 'RITUAL',
    price: 58,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=600&q=80',
    stock: 22,
    slug: 'earthbound-clay-mask',
  },
  {
    name: 'Rose Quartz Mist',
    description: 'A hydrating mist that refreshes and soothes throughout the day.',
    category: 'TONER',
    price: 38,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    stock: 26,
    slug: 'rose-quartz-mist',
  },
];

exports.getProducts = async (req, res) => {
  try {
    const { category, maxPrice, search, sort } = req.query;
    const filter = {};

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (maxPrice) {
      filter.price = { $lte: Number(maxPrice) };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Product.find(filter);

    if (sort === 'priceAsc') {
      query = query.sort({ price: 1 });
    } else if (sort === 'priceDesc') {
      query = query.sort({ price: -1 });
    } else if (sort === 'newest') {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query.exec();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch products', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch product', error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch categories', error: error.message });
  }
};

exports.seedProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Products already seeded' });
    }

    const products = await Product.insertMany(SAMPLE_PRODUCTS);
    res.json({ message: 'Seed complete', products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to seed products', error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, price, image, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const product = new Product({
      name,
      description,
      category,
      price,
      image,
      stock,
      slug,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to add product', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, image, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        price,
        image,
        stock,
        slug,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to delete product', error: error.message });
  }
};
