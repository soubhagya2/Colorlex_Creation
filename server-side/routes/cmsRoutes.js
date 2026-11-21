import express from 'express';
import { getCMSContent, updateCMSContent } from '../controllers/cmsController.js';
import { protect, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCMSContent);
router.put('/', protect, staffOrAdmin, updateCMSContent);

export default router;
