import express from 'express';
import {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, staffOrAdmin, getCoupons);
router.post('/validate', validateCoupon);
router.post('/', protect, staffOrAdmin, createCoupon);
router.put('/:id', protect, staffOrAdmin, updateCoupon);
router.delete('/:id', protect, staffOrAdmin, deleteCoupon);

export default router;
