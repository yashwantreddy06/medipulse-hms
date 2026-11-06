const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Rate-limited authentication endpoints
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Authenticated user profile
router.get('/me', protect, getMe);

module.exports = router;

