const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const request = require('supertest');
const app = require('./index');

const runFullE2ETest = async () => {
  console.log('\n======================================================');
  console.log('   RUNNING COMPLETE E2E VERIFICATION SUITE           ');
  console.log('======================================================\n');

  try {
    // 1. Health check
    console.log('[1/9] Testing GET /api/health...');
    const health = await request(app).get('/api/health');
    console.log('  Status:', health.status, 'Body:', health.body);
    if (health.status !== 200 || health.body.status !== 'ok') {
      throw new Error('Health check failed');
    }

    // 2. Register a new test user
    const testEmail = `candidate_${Date.now()}@example.com`;
    console.log(`[2/9] Testing POST /api/auth/register with ${testEmail}...`);
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Verification User',
      email: testEmail,
      password: 'SecurePass123'
    });
    console.log('  Status:', regRes.status, 'User registered:', regRes.body.user?.email);
    if (regRes.status !== 201 || !regRes.body.token) {
      throw new Error('Registration failed');
    }

    // 3. Login as Admin
    console.log('[3/9] Testing POST /api/auth/login as Admin...');
    const adminLoginRes = await request(app).post('/api/auth/login').send({
      email: 'admin@medipulse.com',
      password: 'AdminPassword123'
    });
    console.log('  Status:', adminLoginRes.status, 'Admin token acquired:', !!adminLoginRes.body.token);
    if (adminLoginRes.status !== 200) throw new Error('Admin login failed');
    const adminToken = adminLoginRes.body.token;

    // Login as Demo Patient
    console.log('      Testing POST /api/auth/login as Patient...');
    const patientLoginRes = await request(app).post('/api/auth/login').send({
      email: 'patient@medipulse.com',
      password: 'PatientPass123'
    });
    console.log('  Status:', patientLoginRes.status, 'Patient token acquired:', !!patientLoginRes.body.token);
    if (patientLoginRes.status !== 200) throw new Error('Patient login failed');
    const patientToken = patientLoginRes.body.token;

    // 4. GET Doctors
    console.log('[4/9] Testing GET /api/doctors (public query & filter)...');
    const docsRes = await request(app).get('/api/doctors?specialization=Cardiology');
    console.log('  Status:', docsRes.status, `Found ${docsRes.body.count} cardiology specialist(s)`);
    if (docsRes.status !== 200 || docsRes.body.doctors.length === 0) {
      throw new Error('Doctors listing failed');
    }
    const testDoctor = docsRes.body.doctors[0];
    console.log(`  Selected Doctor: ${testDoctor.name} (${testDoctor._id})`);

    // 5. POST Appointment as Patient
    console.log('[5/9] Testing POST /api/appointments (Patient booking)...');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateStr = nextWeek.toISOString().split('T')[0];

    const bookRes = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: testDoctor._id,
        date: dateStr,
        timeSlot: '02:00 PM',
        reason: 'Automated verification checkup and blood pressure monitoring.'
      });
    console.log('  Status:', bookRes.status, 'Appointment booked ID:', bookRes.body.appointment?._id);
    if (bookRes.status !== 201) throw new Error('Booking appointment failed');
    const newAppointmentId = bookRes.body.appointment._id;

    // 6. GET /api/appointments/mine
    console.log('[6/9] Testing GET /api/appointments/mine...');
    const myAppRes = await request(app)
      .get('/api/appointments/mine')
      .set('Authorization', `Bearer ${patientToken}`);
    console.log('  Status:', myAppRes.status, `Retrieved ${myAppRes.body.count} patient appointments`);
    if (myAppRes.status !== 200) throw new Error('Fetching patient appointments failed');

    // 7. PATCH /api/appointments/:id/status as Admin
    console.log(`[7/9] Testing PATCH /api/appointments/${newAppointmentId}/status (Confirming as Admin)...`);
    const statusRes = await request(app)
      .patch(`/api/appointments/${newAppointmentId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' });
    console.log('  Status:', statusRes.status, 'New status:', statusRes.body.appointment?.status);
    if (statusRes.status !== 200 || statusRes.body.appointment?.status !== 'confirmed') {
      throw new Error('Appointment status update failed');
    }

    // 8. POST /api/reviews
    console.log('[8/9] Testing POST /api/reviews...');
    const reviewRes = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: testDoctor._id,
        rating: 5,
        comment: 'Exceptional care during consultation!'
      });
    console.log('  Status:', reviewRes.status, 'Review created:', reviewRes.body.review?.rating);
    if (reviewRes.status !== 201) throw new Error('Review creation failed');

    // 9. Admin Doctor CRUD
    console.log('[9/9] Testing Admin Doctor CRUD (Create, Update, Delete)...');
    const newDocRes = await request(app)
      .post('/api/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Dr. Test Created By Admin',
        specialization: 'Neurology',
        experienceYears: 7,
        fees: 99,
        image: 'https://placehold.co/400x400/0284c7/ffffff?text=Dr+AdminTest',
        bio: 'Created via automated E2E test verification run.'
      });
    console.log('  Doctor created:', newDocRes.status, newDocRes.body.doctor?.name);
    const createdDocId = newDocRes.body.doctor._id;

    const updateDocRes = await request(app)
      .put(`/api/doctors/${createdDocId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ fees: 115 });
    console.log('  Doctor updated:', updateDocRes.status, 'New Fee:', updateDocRes.body.doctor?.fees);

    const deleteDocRes = await request(app)
      .delete(`/api/doctors/${createdDocId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('  Doctor deleted:', deleteDocRes.status, deleteDocRes.body.message);

    console.log('\n======================================================');
    console.log('   ALL E2E INTEGRATION & CRITICAL TESTS PASSED!      ');
    console.log('======================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('E2E TEST FAILURE:', err);
    process.exit(1);
  }
};

runFullE2ETest();

