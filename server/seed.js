const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();
const mongoose = require('mongoose');
const seedDatabase = require('./utils/seeder');

const runSeed = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Error: MONGO_URI is not set in environment or server/.env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('[Seed] Connected to MongoDB database...');
    console.log('[Seed] Populating collections with fresh demo records...');

    const result = await seedDatabase();

    console.log('\n============================================================');
    console.log('              MEDIPULSE DATABASE SEED COMPLETED             ');
    console.log('============================================================');
    console.log('  Demo Admin Account:');
    console.log('    Email:    admin@medipulse.com');
    console.log('    Password: AdminPassword123');
    console.log('    Role:     admin\n');
    console.log('  Demo Patient Account:');
    console.log('    Email:    patient@medipulse.com');
    console.log('    Password: PatientPass123');
    console.log('    Role:     user\n');
    console.log(`  Doctors Seeded:      ${result.doctorsCount} specialists`);
    console.log(`  Sample Appointments: 2 appointments`);
    console.log('============================================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

runSeed();
