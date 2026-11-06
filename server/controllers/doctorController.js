const Doctor = require('../models/Doctor');

/**
 * @desc    Get all doctors with optional search and specialization filtering
 * @route   GET /api/doctors
 * @access  Public
 */
const getDoctors = async (req, res, next) => {
  try {
    const { search, specialization } = req.query;
    const query = {};

    if (specialization && specialization !== 'All') {
      query.specialization = { $regex: new RegExp(`^${specialization}$`, 'i') };
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { specialization: searchRegex },
        { bio: searchRegex }
      ];
    }

    const doctors = await Doctor.find(query).sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single doctor by ID
 * @route   GET /api/doctors/:id
 * @access  Public
 */
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found with the requested ID.'
      });
    }

    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new doctor profile
 * @route   POST /api/doctors
 * @access  Private (Admin only)
 */
const createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      specialization,
      experienceYears,
      fees,
      availability,
      image,
      bio
    } = req.body;

    if (!name || !specialization || experienceYears === undefined || fees === undefined || !bio) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, specialization, experience, fees, and bio.'
      });
    }

    const doctor = await Doctor.create({
      name: name.trim(),
      specialization: specialization.trim(),
      experienceYears: Number(experienceYears),
      fees: Number(fees),
      availability: availability || {
        days: ['Monday', 'Wednesday', 'Friday'],
        timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
      },
      image: image || 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor',
      bio: bio.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully.',
      doctor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a doctor profile
 * @route   PUT /api/doctors/:id
 * @access  Private (Admin only)
 */
const updateDoctor = async (req, res, next) => {
  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      });
    }

    doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully.',
      doctor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a doctor profile
 * @route   DELETE /api/doctors/:id
 * @access  Private (Admin only)
 */
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      });
    }

    await Doctor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Doctor profile deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};

