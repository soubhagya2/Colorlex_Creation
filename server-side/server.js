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

// Allowed frontend client origins
const allowedOrigins = [
  'https://colorlex-creation.vercel.app',
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow production Vercel app, all Vercel preview deployments, or local environments
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }

    // Safe fallback for production requests
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// Middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: 'online',
    app: 'ColorLex Creation API',
    database: dbStatusMap[dbState] || 'unknown',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('ColorLex Creation Backend REST API is running.');
});

// Start listening immediately so Render detects port binding without delay
app.listen(PORT, () => {
  console.log(`🚀 ColorLex Backend Server running on port ${PORT}`);
});

// Connect to MongoDB Atlas asynchronously
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn('⚠️ Warning: MONGO_URI environment variable is not defined.');
  console.warn('   Please set MONGO_URI in your Render Dashboard under Environment.');
} else {
  console.log('📡 Connecting to MongoDB database...');
  mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 8000
    })
    .then(() => {
      console.log('✅ Connected to MongoDB database successfully');
    })
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.error('👉 Tip: Check your Render MONGO_URI environment variable and ensure MongoDB Atlas Network Access allows 0.0.0.0/0');
    });
}
