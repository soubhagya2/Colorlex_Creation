import Category from '../models/Category.js';
import Product from '../models/Product.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parentCategory', 'name slug')
      .populate({
        path: 'products',
        select: 'name slug basePrice images isFeatured isBestSeller'
      })
      .sort({ displayOrder: 1, name: 1 });
    return res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parentCategory', 'name slug')
      .populate({
        path: 'products',
        select: 'name slug basePrice images isFeatured isBestSeller'
      });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, parentCategory, isFeatured, displayOrder } = req.body;
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await Category.create({
      name,
      slug: generatedSlug,
      description: description || '',
      image: image || '/uploads/category-default.jpg',
      parentCategory: parentCategory || null,
      isFeatured: Boolean(isFeatured),
      displayOrder: Number(displayOrder) || 0
    });

    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    if (req.body.displayOrder !== undefined) {
      req.body.displayOrder = Number(req.body.displayOrder) || 0;
    }

    Object.assign(category, req.body);
    await category.save();

    return res.json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
