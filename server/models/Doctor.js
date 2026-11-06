const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
      trim: true
    },
    experienceYears: {
      type: Number,
      required: [true, 'Please specify years of experience'],
      min: [0, 'Experience cannot be negative']
    },
    fees: {
      type: Number,
      required: [true, 'Please specify consultation fees'],
      min: [0, 'Fees cannot be negative']
    },
    availability: {
      days: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      timeSlots: {
        type: [String],
        default: ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM', '06:00 PM']
      }
    },
    image: {
      type: String,
      default: 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor'
    },
    bio: {
      type: String,
      required: [true, 'Please provide doctor bio / background'],
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);

