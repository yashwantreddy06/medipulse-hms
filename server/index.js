const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config(); // Fallback to root if present
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Route handlers
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Initialize MongoDB connection
connectDB();

// Security HTTP headers (cross-origin resource sharing friendly)
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// Flexible & resilient CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://medipulse-hms-one.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
]
  .filter(Boolean)
  .map((url) => url.trim().replace(/\/+$/, ''));

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (mobile, curl, Postman)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/+$/, '');

    // Allow configured origins, all vercel.app deployments, and localhost
    if (
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }

    // Default permissive allow to prevent preflight blockage
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to MediPulse Healthcare Management API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Mount routes under /api (standard REST convention)
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);

// Also mount routes without /api prefix for bulletproof client compatibility
app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/reviews', reviewRoutes);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` MediPulse API Server running on port ${PORT}`);
    console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });

  // Graceful shutdown
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

module.exports = app;
