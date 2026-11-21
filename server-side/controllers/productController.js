import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { calculateProductPrice } from '../utils/priceCalculator.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search, featured, bestSeller, sort } = req.query;
    let query = {};

    if (category) {
      const catDoc = await Category.findOne({
        $or: [{ _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }, { slug: category }]
      });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    if (featured === 'true') query.isFeatured = true;
    if (bestSeller === 'true') query.isBestSeller = true;

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { basePrice: 1 };
    if (sort === 'price_desc') sortOptions = { basePrice: -1 };
    if (sort === 'name') sortOptions = { name: 1 };

    const products = await Product.find(query).populate('category', 'name slug').sort(sortOptions);
    return res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlugOrId = async (req, res) => {
  try {
    const { identifier } = req.params;
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);

    const product = await Product.findOne({
      $or: [{ slug: identifier }, isObjectId ? { _id: identifier } : null].filter(Boolean)
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      sku,
      category,
      description,
      basePrice,
      isFeatured,
      isBestSeller,
      variants,
      bulkPricing,
      turnaroundOptions,
      images,
      specifications
    } = req.body;

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const generatedSku = sku || 'CLX-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    const product = await Product.create({
      name,
      slug: generatedSlug,
      sku: generatedSku,
      category,
      description,
      basePrice: Number(basePrice) || 10,
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      variants: variants || { sizes: [], materials: [], finishes: [] },
      bulkPricing: bulkPricing || [],
      turnaroundOptions: turnaroundOptions || [],
      images: images || ['/uploads/default-product.jpg'],
      specifications: specifications || []
    });

    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    Object.assign(product, req.body);
    await product.save();

    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const calculatePrice = async (req, res) => {
  try {
    const { productId, selectedSize, selectedMaterial, selectedFinish, selectedTurnaround, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const calculation = calculateProductPrice({
      product,
      selectedSize,
      selectedMaterial,
      selectedFinish,
      selectedTurnaround,
      quantity: Number(quantity) || 1
    });

    return res.json({ success: true, data: calculation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
