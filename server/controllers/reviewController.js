const Review = require('../models/Review');
const Doctor = require('../models/Doctor');

/**
 * Helper to recalculate doctor's aggregate rating
 */
const recalculateDoctorRating = async (doctorId) => {
  const reviews = await Review.find({ doctor: doctorId });
  if (reviews.length === 0) {
    await Doctor.findByIdAndUpdate(doctorId, {
      rating: 5.0,
      reviewsCount: 0
    });
    return;
  }

  const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const avg = (total / reviews.length).toFixed(1);

  await Doctor.findByIdAndUpdate(doctorId, {
    rating: parseFloat(avg),
    reviewsCount: reviews.length
  });
};

/**
 * @desc    Post a review for a doctor
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = async (req, res, next) => {
  try {
    const { doctorId, rating, comment } = req.body;

    if (!doctorId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctorId, rating (1-5), and feedback comment.'
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a numeric value between 1 and 5.'
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      });
    }

    // Check if user already reviewed this doctor
    const existing = await Review.findOne({
      user: req.user.id,
      doctor: doctorId
    });

    let review;
    if (existing) {
      existing.rating = numRating;
      existing.comment = comment.trim();
      review = await existing.save();
    } else {
      review = await Review.create({
        user: req.user.id,
        doctor: doctorId,
        rating: numRating,
        comment: comment.trim()
      });
    }

    await recalculateDoctorRating(doctorId);

    const populated = await Review.findById(review._id).populate(
      'user',
      'name'
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      review: populated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews for a specific doctor
 * @route   GET /api/reviews/doctor/:doctorId
 * @access  Public
 */
const getDoctorReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ doctor: req.params.doctorId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a review (Owner or Admin)
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.'
      });
    }

    const isOwner = review.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this review.'
      });
    }

    const doctorId = review.doctor;
    await Review.findByIdAndDelete(req.params.id);

    await recalculateDoctorRating(doctorId);

    res.status(200).json({
      success: true,
      message: 'Review removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getDoctorReviews,
  deleteReview
};

