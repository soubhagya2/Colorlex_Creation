import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateTrackingInfo,
  getOrderInvoice
} from '../controllers/orderController.js';
import { protect, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/admin/all', protect, staffOrAdmin, getAllOrders);
router.get('/:id', getOrderById);
router.get('/:id/invoice', getOrderInvoice);
router.put('/:id/status', protect, staffOrAdmin, updateOrderStatus);
router.put('/:id/tracking', protect, staffOrAdmin, updateTrackingInfo);

export default router;
