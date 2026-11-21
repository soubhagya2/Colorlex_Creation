import express from 'express';
import {
  createDesignRequest,
  getDesignRequests,
  getDesignRequestById,
  uploadProof,
  customerProofFeedback
} from '../controllers/designRequestController.js';
import { protect, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createDesignRequest);
router.get('/', protect, getDesignRequests);
router.get('/:id', getDesignRequestById);
router.post('/:id/proof', protect, staffOrAdmin, uploadProof);
router.post('/:id/feedback', customerProofFeedback);

export default router;
