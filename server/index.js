const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config(); // Fallback to root if present
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const seedDatabase = require('./utils/seeder');
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

// Security HTTP headers
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
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.trim().replace(/\/+$/, '');
    if (
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
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
    documentation: '/api/health',
    seeder: '/api/seed'
  });
});

// One-click HTTP database seeder (ideal for cloud environments like Render)
app.get(['/api/seed', '/seed'], async (req, res) => {
  try {
    const result = await seedDatabase();
    res.status(200).json({
      success: true,
      message: 'MediPulse database successfully populated with demo records!',
      admin: {
        email: 'admin@medipulse.com',
        password: 'AdminPassword123',
        role: 'admin'
      },
      patient: {
        email: 'patient@medipulse.com',
        password: 'PatientPass123',
        role: 'user'
      },
      doctorsSeeded: result.doctorsCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Database seeding failed: ${error.message}`
    });
  }
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
    console.log(` HTTP Seeder:  http://localhost:${PORT}/api/seed`);
    console.log(`===============================================`);
  });

  // Graceful shutdown
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

module.exports = app;
