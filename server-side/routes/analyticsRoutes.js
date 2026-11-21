import express from 'express';
import { getDashboardAnalytics, exportSalesReport } from '../controllers/analyticsController.js';
import { protect, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, staffOrAdmin, getDashboardAnalytics);
router.get('/export-csv', protect, staffOrAdmin, exportSalesReport);

export default router;
