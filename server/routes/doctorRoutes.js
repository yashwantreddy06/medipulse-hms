const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');
const { protect, adminOnly } = require('../middleware/auth');

// Public doctor discovery routes
router.get('/', getDoctors);
router.get('/:id', getDoctorById);

// Admin-only doctor management routes
router.post('/', protect, adminOnly, createDoctor);
router.put('/:id', protect, adminOnly, updateDoctor);
router.delete('/:id', protect, adminOnly, deleteDoctor);

module.exports = router;

