const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

/**
 * @desc    Book a new appointment
 * @route   POST /api/appointments
 * @access  Private (Registered patient)
 */
const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;

    if (!doctorId || !date || !timeSlot || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctorId, appointment date, timeSlot, and reason.'
      });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Selected doctor could not be found.'
      });
    }

    // Check for past dates
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date cannot be in the past.'
      });
    }

    // Check for duplicate pending/confirmed booking by same user for same doctor & slot
    const existingBooking = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked for this doctor. Please select another slot.'
      });
    }

    const appointment = await Appointment.create({
      user: req.user.id,
      doctor: doctorId,
      date,
      timeSlot,
      reason: reason.trim(),
      status: 'pending'
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'name specialization fees image availability')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully. Awaiting confirmation.',
      appointment: populatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get appointments for the logged-in user
 * @route   GET /api/appointments/mine
 * @access  Private
 */
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate('doctor', 'name specialization fees image availability')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all appointments across the system
 * @route   GET /api/appointments
 * @access  Private (Admin only)
 */
const getAllAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate('doctor', 'name specialization fees image')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update appointment status (Admin or Owner cancel)
 * @route   PUT /api/appointments/:id/status
 * @access  Private
 */
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    const isOwner = appointment.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Role checks
    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this appointment.'
      });
    }

    // Owner can only cancel their own appointment
    if (isOwner && !isAdmin) {
      if (status !== 'cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Patients can only cancel their own appointments.'
        });
      }
      if (appointment.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Completed appointments cannot be cancelled.'
        });
      }
    }

    appointment.status = status;
    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('doctor', 'name specialization fees image')
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      appointment: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private (Admin or Owner)
 */
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    const isOwner = appointment.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this appointment.'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment
};

