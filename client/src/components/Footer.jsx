import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeartbeat,
  faPhoneAlt,
  faEnvelope,
  faMapMarkerAlt,
  faShieldAlt,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        borderTop: '1px solid #1e293b',
        paddingTop: '3.5rem',
        paddingBottom: '2rem',
        marginTop: 'auto'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand Info */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1rem'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '1.15rem'
                }}
              >
                <FontAwesomeIcon icon={faHeartbeat} />
              </div>
              <span
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#ffffff'
                }}
              >
                Medi<span style={{ color: 'var(--primary)' }}>Pulse</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '1.25rem' }}>
              Your trusted full-stack digital healthcare hub. Book certified medical specialists, track appointment schedules, and experience hassle-free consultations.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#38bdf8' }}>
              <FontAwesomeIcon icon={faShieldAlt} />
              <span>HIPAA Compliant & Secure Medical Data</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.2rem', fontWeight: 700 }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/" style={{ color: '#94a3b8', transition: 'var(--transition)' }}>
                  Home Platform
                </Link>
              </li>
              <li>
                <Link to="/doctors" style={{ color: '#94a3b8', transition: 'var(--transition)' }}>
                  Specialist Directory
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" style={{ color: '#94a3b8', transition: 'var(--transition)' }}>
                  Schedule Consultation
                </Link>
              </li>
              <li>
                <Link to="/my-appointments" style={{ color: '#94a3b8', transition: 'var(--transition)' }}>
                  My Health Appointments
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#94a3b8', transition: 'var(--transition)' }}>
                  Patient Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.2rem', fontWeight: 700 }}>
              Specialties
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>Cardiovascular Health</li>
              <li>Clinical Dermatology</li>
              <li>Neurological Disorders</li>
              <li>Pediatric Child Health</li>
              <li>Orthopedics & Spine</li>
              <li>Psychiatry & Behavioral Health</li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.2rem', fontWeight: 700 }}>
              Emergency & Care Line
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FontAwesomeIcon icon={faPhoneAlt} style={{ color: '#38bdf8' }} />
                <span>+1 (800) 456-PULSE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ color: '#38bdf8' }} />
                <span>care@medipulse-health.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FontAwesomeIcon icon={faClock} style={{ color: '#38bdf8' }} />
                <span>24/7 Virtual Emergency Triage</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#38bdf8' }} />
                <span>Medical Plaza, Tech Innovation Park</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem'
          }}
        >
          <p>© {new Date().getFullYear()} MediPulse Health Technologies. All rights reserved.</p>
          <p style={{ color: '#64748b' }}>
            Built for Academic Evaluation & Training Submission | Team Apex Innovators
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

