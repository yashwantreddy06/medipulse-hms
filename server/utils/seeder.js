const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');

const seedDatabase = async () => {
  // 1. Wipe existing data
  await User.deleteMany({});
  await Doctor.deleteMany({});
  await Appointment.deleteMany({});
  await Review.deleteMany({});

  // 2. Create Users (Admin + Demo Patient)
  const adminUser = await User.create({
    name: 'System Administrator',
    email: 'admin@medipulse.com',
    password: 'AdminPassword123',
    role: 'admin'
  });

  const demoUser = await User.create({
    name: 'Demo Patient',
    email: 'patient@medipulse.com',
    password: 'PatientPass123',
    role: 'user'
  });

  // 3. Create 8 Diverse Medical Specialists
  const doctorsData = [
    {
      name: 'Dr. Rajesh Sharma',
      specialization: 'Cardiology',
      experienceYears: 15,
      fees: 120,
      availability: {
        days: ['Monday', 'Wednesday', 'Friday'],
        timeSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM']
      },
      image: 'https://placehold.co/400x400/0284c7/ffffff?text=Dr.+Sharma+Cardio',
      bio: 'Senior Consultant Interventional Cardiologist with over 15 years of clinical expertise in preventative cardiovascular wellness, coronary care, and vascular intervention.',
      rating: 4.9,
      reviewsCount: 142,
      isAvailable: true
    },
    {
      name: 'Dr. Anita Desai',
      specialization: 'Dermatology',
      experienceYears: 11,
      fees: 85,
      availability: {
        days: ['Tuesday', 'Thursday', 'Saturday'],
        timeSlots: ['10:00 AM', '11:30 AM', '03:00 PM', '05:00 PM']
      },
      image: 'https://placehold.co/400x400/0d9488/ffffff?text=Dr.+Desai+Derma',
      bio: 'Board-certified dermatologist specializing in advanced medical dermatology, acne management, clinical skincare diagnostics, and laser dermatology treatments.',
      rating: 4.8,
      reviewsCount: 98,
      isAvailable: true
    },
    {
      name: 'Dr. Vikram Malhotra',
      specialization: 'Neurology',
      experienceYears: 18,
      fees: 150,
      availability: {
        days: ['Monday', 'Tuesday', 'Thursday'],
        timeSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:30 PM']
      },
      image: 'https://placehold.co/400x400/2563eb/ffffff?text=Dr.+Malhotra+Neuro',
      bio: 'Chief of Neurology with international fellowship in neurovascular disorders, chronic migraine therapy, epilepsy management, and neurological rehabilitation.',
      rating: 4.9,
      reviewsCount: 165,
      isAvailable: true
    },
    {
      name: 'Dr. Sarah Jenkins',
      specialization: 'Pediatrics',
      experienceYears: 9,
      fees: 75,
      availability: {
        days: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: ['08:30 AM', '10:00 AM', '01:30 PM', '03:30 PM']
      },
      image: 'https://placehold.co/400x400/ec4899/ffffff?text=Dr.+Jenkins+Pedia',
      bio: 'Compassionate pediatric specialist focusing on developmental milestones, newborn immunization, child nutrition, and acute childhood illnesses.',
      rating: 4.8,
      reviewsCount: 112,
      isAvailable: true
    },
    {
      name: 'Dr. Arun Patel',
      specialization: 'Orthopedics',
      experienceYears: 14,
      fees: 110,
      availability: {
        days: ['Tuesday', 'Wednesday', 'Saturday'],
        timeSlots: ['10:00 AM', '12:00 PM', '03:00 PM', '05:30 PM']
      },
      image: 'https://placehold.co/400x400/f59e0b/ffffff?text=Dr.+Patel+Ortho',
      bio: 'Orthopedic surgeon and sports injury consultant specializing in arthroscopy, knee replacement therapies, spinal posture care, and fracture recovery.',
      rating: 4.7,
      reviewsCount: 89,
      isAvailable: true
    },
    {
      name: 'Dr. Priya Nambiar',
      specialization: 'Psychiatry',
      experienceYears: 10,
      fees: 95,
      availability: {
        days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        timeSlots: ['11:00 AM', '01:00 PM', '04:00 PM', '06:00 PM']
      },
      image: 'https://placehold.co/400x400/8b5cf6/ffffff?text=Dr.+Nambiar+Psych',
      bio: 'Specialist psychiatrist and mental wellness practitioner focusing on cognitive behavioral therapy, anxiety disorders, depression therapy, and stress resilience.',
      rating: 4.9,
      reviewsCount: 130,
      isAvailable: true
    },
    {
      name: 'Dr. David Miller',
      specialization: 'General Medicine',
      experienceYears: 13,
      fees: 60,
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: ['08:00 AM', '10:00 AM', '02:00 PM', '04:00 PM', '05:30 PM']
      },
      image: 'https://placehold.co/400x400/10b981/ffffff?text=Dr.+Miller+General',
      bio: 'Experienced general practitioner providing primary healthcare, routine health checkups, chronic disease management, and family medicine consultations.',
      rating: 4.9,
      reviewsCount: 205,
      isAvailable: true
    },
    {
      name: 'Dr. Kavita Sundaram',
      specialization: 'ENT Specialist',
      experienceYears: 12,
      fees: 80,
      availability: {
        days: ['Monday', 'Thursday', 'Saturday'],
        timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM']
      },
      image: 'https://placehold.co/400x400/06b6d4/ffffff?text=Dr.+Sundaram+ENT',
      bio: 'Consultant Otorhinolaryngologist handling hearing disorders, allergic rhinitis, sinusitis, sleep apnea evaluation, and microscopic ear surgery.',
      rating: 4.8,
      reviewsCount: 76,
      isAvailable: true
    }
  ];

  const seededDoctors = await Doctor.insertMany(doctorsData);

  // 4. Create Sample Appointments
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  await Appointment.create([
    {
      user: demoUser._id,
      doctor: seededDoctors[0]._id,
      date: tomorrowStr,
      timeSlot: '09:00 AM',
      reason: 'Routine annual cardiovascular health checkup and lipid profiling discussion.',
      status: 'confirmed'
    },
    {
      user: demoUser._id,
      doctor: seededDoctors[1]._id,
      date: nextWeekStr,
      timeSlot: '11:30 AM',
      reason: 'Consultation for allergic dermatitis and seasonal skin dryness.',
      status: 'pending'
    }
  ]);

  // 5. Seed Reviews
  await Review.create([
    {
      user: demoUser._id,
      doctor: seededDoctors[0]._id,
      rating: 5,
      comment: 'Dr. Sharma is incredibly attentive and patient. He explained my ECG report in great detail.'
    }
  ]);

  return {
    doctorsCount: seededDoctors.length,
    adminEmail: adminUser.email,
    patientEmail: demoUser.email
  };
};

module.exports = seedDatabase;

