import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', protect, staffOrAdmin, createCategory);
router.put('/:id', protect, staffOrAdmin, updateCategory);
router.delete('/:id', protect, staffOrAdmin, deleteCategory);

export default router;
