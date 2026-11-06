const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/auth');

// Patient appointment routes
router.post('/', protect, createAppointment);
router.get('/mine', protect, getMyAppointments);

// Admin-wide appointment routes
router.get('/', protect, adminOnly, getAllAppointments);

// Appointment status update (Admin or Owner cancel)
router.put('/:id/status', protect, updateAppointmentStatus);
router.patch('/:id/status', protect, updateAppointmentStatus);

// Cancel / delete appointment
router.delete('/:id', protect, deleteAppointment);

module.exports = router;

