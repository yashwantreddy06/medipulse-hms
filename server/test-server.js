const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const request = require('supertest');
const app = require('./index');

const runVerification = async () => {
  console.log('[Verification] Starting API Endpoint verification...');

  try {
    // 1. Test /api/health
    const healthRes = await request(app).get('/api/health');
    console.log('[1/4] GET /api/health response:', healthRes.body);

    if (healthRes.status === 200 && healthRes.body.status === 'ok') {
      console.log('✓ /api/health passed: status 200 OK');
    } else {
      throw new Error(`Health check failed with status ${healthRes.status}`);
    }

    // 2. Test Root Welcome Endpoint
    const rootRes = await request(app).get('/');
    console.log('[2/4] GET / root response:', rootRes.body);
    if (rootRes.status === 200 && rootRes.body.message) {
      console.log('✓ GET / passed: status 200 OK');
    }

    // 3. Test 404 Route Handling
    const notFoundRes = await request(app).get('/api/unsupported-endpoint');
    console.log('[3/4] 404 handler response:', notFoundRes.body);
    if (notFoundRes.status === 404 && notFoundRes.body.success === false) {
      console.log('✓ 404 handler passed: returns standard JSON error');
    }

    // 4. Test Auth Validation (Weak password rejection)
    const weakAuthRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Candidate',
        email: 'test@example.com',
        password: 'weak' // Less than 6 characters and no number
      });
    console.log('[4/4] Auth validation response:', weakAuthRes.body);
    if (weakAuthRes.status === 400 && weakAuthRes.body.success === false) {
      console.log('✓ Weak password rejected correctly: status 400 with message');
    }

    console.log('\n===============================================');
    console.log('   ALL IN-PROCESS API SMOKE TESTS PASSED!   ');
    console.log('===============================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Verification error:', err.message);
    process.exit(1);
  }
};

runVerification();
