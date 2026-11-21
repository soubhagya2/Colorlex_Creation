import express from 'express';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file was uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    message: 'File uploaded successfully',
    fileUrl,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

export default router;
