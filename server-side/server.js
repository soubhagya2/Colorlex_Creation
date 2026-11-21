import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import designRequestRoutes from './routes/designRequestRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/design-requests', designRequestRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'ColorLex Creation API',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('ColorLex Creation Backend REST API is running.');
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/printing';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB database successfully');
    app.listen(PORT, () => {
      console.log(`🚀 ColorLex Backend Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.warn('⚠️ Could not connect to local MongoDB. Running API server in standalone mode:', err.message);
    app.listen(PORT, () => {
      console.log(`🚀 ColorLex Backend Server running on http://localhost:${PORT} (Standalone API Mode)`);
    });
  });
