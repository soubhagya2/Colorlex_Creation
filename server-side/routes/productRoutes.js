import express from 'express';
import {
  getProducts,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  deleteProduct,
  calculatePrice
} from '../controllers/productController.js';
import { protect, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/calculate-price', calculatePrice);
router.get('/:identifier', getProductBySlugOrId);
router.post('/', protect, staffOrAdmin, createProduct);
router.put('/:id', protect, staffOrAdmin, updateProduct);
router.delete('/:id', protect, staffOrAdmin, deleteProduct);

export default router;
