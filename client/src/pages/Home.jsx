import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import DoctorCard from '../components/DoctorCard';
import Loader from '../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faUserMd,
  faClock,
  faShieldAlt,
  faStar,
  faSearch,
  faCheckCircle,
  faArrowRight,
  faHospitalUser,
  faComments
} from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosClient.get('/doctors');
        if (res.data && res.data.success) {
          // Take top 4 doctors
          setFeaturedDoctors(res.data.doctors.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load doctors preview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          padding: '4.5rem 0 3.5rem',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '3rem',
            alignItems: 'center'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(2, 132, 199, 0.1)',
                color: 'var(--primary)',
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.25rem'
              }}
            >
              <FontAwesomeIcon icon={faShieldAlt} />
              <span>Next-Gen Healthcare Management</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.25rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: 'var(--text-main)',
                marginBottom: '1.25rem'
              }}
            >
              Consult Expert Doctors <br />
              <span style={{ color: 'var(--primary)' }}>Anytime, Anywhere.</span>
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '560px'
              }}
            >
              Connect instantly with top certified healthcare practitioners. Book online consultations, view real-time slot availability, and manage your family's health seamlessly.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <Link to="/doctors" className="btn btn-primary btn-lg">
                <FontAwesomeIcon icon={faSearch} />
                Find Specialists
              </Link>
              <Link to="/book-appointment" className="btn btn-outline btn-lg">
                <FontAwesomeIcon icon={faCalendarCheck} />
                Book Appointment
              </Link>
            </div>

            {/* Quick stats banner */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(2, 132, 199, 0.2)'
              }}
            >
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                  50+
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Specialists On Call
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)' }}>
                  15k+
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Happy Patients
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  99.4%
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Satisfaction Rate
                </div>
              </div>
            </div>
          </div>

          {/* Hero Illustration / Visual Block */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '420px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#ffffff',
                padding: '2rem',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: 'var(--primary)'
                  }}
                >
                  <FontAwesomeIcon icon={faUserMd} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', margin: 0 }}>Dr. Rajesh Sharma</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                    Cardiologist • 15 Yrs Exp.
                  </p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-alt)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.875rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Next Available Slot</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 700 }}>Tomorrow, 09:00 AM</div>
                </div>
                <span className="badge badge-confirmed">Available</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#16a34a' }} />
                <span>Verified Medical Credentials</span>
              </div>

              <Link to="/doctors" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Explore All Doctors
              </Link>
            </div>
          </div>
        </div>

        {/* Hero responsive style */}
        <style>{`
          @media (max-width: 900px) {
            section > .container {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* Features Grid ("Why MediPulse?") */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
          <h2 style={{ fontSize: '2.1rem', marginBottom: '0.75rem' }}>
            Why Choose MediPulse?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            A streamlined digital health platform engineered for convenience, speed, and trusted clinical care.
          </p>
        </div>

        <div className="grid-3">
          <div className="card card-hover">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                marginBottom: '1.25rem'
              }}
            >
              <FontAwesomeIcon icon={faUserMd} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Verified Medical Experts
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Every physician on MediPulse undergoes comprehensive credentials verification, clinical review, and licensing checks.
            </p>
          </div>

          <div className="card card-hover">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                marginBottom: '1.25rem'
              }}
            >
              <FontAwesomeIcon icon={faClock} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Instant Slot Booking
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              No more waiting on hold. Pick your preferred consultation date and available morning or evening time slot in 30 seconds.
            </p>
          </div>

          <div className="card card-hover">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                marginBottom: '1.25rem'
              }}
            >
              <FontAwesomeIcon icon={faShieldAlt} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Transparent Healthcare
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Upfront consultation fees with zero hidden surcharges. Transparent patient reviews and verified rating metrics.
            </p>
          </div>
        </div>
      </section>

      {/* "How It Works" Section */}
      <section style={{ backgroundColor: 'var(--bg-alt)', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-pill" style={{ marginBottom: '0.75rem' }}>
              Simple 3-Step Journey
            </span>
            <h2 style={{ fontSize: '2.1rem', marginBottom: '0.75rem' }}>
              How MediPulse Works
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Follow these simple steps to schedule your medical appointment with peace of mind.
            </p>
          </div>

          <div className="grid-3">
            {/* Step 1 */}
            <div
              className="card"
              style={{
                position: 'relative',
                textAlign: 'center',
                padding: '2.5rem 1.75rem'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  margin: '0 auto 1.25rem'
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Find a Specialist</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Filter our verified specialist catalog by clinical department, experience level, consultation fees, or name.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="card"
              style={{
                position: 'relative',
                textAlign: 'center',
                padding: '2.5rem 1.75rem'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  margin: '0 auto 1.25rem'
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Choose Date & Slot</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Select a convenient consultation day and open appointment time slot. Enter your consultation reason.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="card"
              style={{
                position: 'relative',
                textAlign: 'center',
                padding: '2.5rem 1.75rem'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  margin: '0 auto 1.25rem'
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Receive Care</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Access appointment confirmations, updates, and track progress right from your personal dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Preview */}
      <section className="container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            gap: '1rem'
          }}
        >
          <div>
            <span className="badge badge-pill" style={{ marginBottom: '0.5rem' }}>
              Specialist Directory
            </span>
            <h2 style={{ fontSize: '2.1rem', margin: 0 }}>Top Rated Doctors</h2>
          </div>
          <Link to="/doctors" className="btn btn-outline">
            View All Doctors <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        {loading ? (
          <Loader message="Fetching available medical specialists..." />
        ) : featuredDoctors.length > 0 ? (
          <div className="grid-4">
            {featuredDoctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              No doctors currently listed. Run the seed script on the backend to load sample doctors.
            </p>
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '4.5rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2.1rem', marginBottom: '0.75rem' }}>
              Patient Experiences & Feedback
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Read authentic feedback from individuals who scheduled consultations with our medical specialists.
            </p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#f59e0b', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.25rem' }}>
                  "Booking an appointment with Dr. Sharma took under two minutes. His diagnosis and preventative advice made an immense difference in managing my hypertension."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  RK
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Rohan Kapoor</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Cardiology Patient</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#f59e0b', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.25rem' }}>
                  "I was able to schedule a dermatologist visit for chronic acne with Dr. Desai without waiting in endless clinic queues. The platform's status tracking is superb!"
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  SM
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Sneha Mukherjee</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Dermatology Patient</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#f59e0b', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.25rem' }}>
                  "Finding an experienced pediatrician for my toddler was seamless on MediPulse. Dr. Jenkins was warm, patient, and thoroughly addressed all our dietary concerns."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  AT
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Ananya Tiwari</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Pediatric Care Parent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="container" style={{ marginBottom: '2rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <h2 style={{ fontSize: '2.25rem', color: '#ffffff', marginBottom: '1rem' }}>
            Ready to Prioritize Your Wellness?
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '600px',
              margin: '0 auto 2rem',
              lineHeight: 1.6
            }}
          >
            Create your account today, search certified healthcare doctors, and book your consultation in moments.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="btn btn-lg"
              style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 700 }}
            >
              Get Started Now
            </Link>
            <Link
              to="/doctors"
              className="btn btn-outline btn-lg"
              style={{ borderColor: '#ffffff', color: '#ffffff' }}
            >
              Browse Specialists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

