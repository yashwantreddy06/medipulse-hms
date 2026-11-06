const express = require('express');
const router = express.Router();
const {
  createReview,
  getDoctorReviews,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public review retrieval
router.get('/doctor/:doctorId', getDoctorReviews);

// Authenticated reviews management
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;

