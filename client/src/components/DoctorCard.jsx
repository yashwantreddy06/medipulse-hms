import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faBriefcase,
  faCalendarCheck,
  faUserMd
} from '@fortawesome/free-solid-svg-icons';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem', background: '#e2e8f0', aspectRatio: '1/1' }}>
        <img
          src={doctor.image || 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor'}
          alt={doctor.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor';
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#d97706',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <FontAwesomeIcon icon={faStar} />
          <span>{doctor.rating ? doctor.rating.toFixed(1) : '5.0'}</span>
          <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>
            ({doctor.reviewsCount || 0})
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span className="badge badge-pill">
            <FontAwesomeIcon icon={faUserMd} style={{ fontSize: '0.75rem' }} />
            {doctor.specialization}
          </span>
        </div>

        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
          {doctor.name}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '0.75rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1
          }}
        >
          {doctor.bio}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border)',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
            <FontAwesomeIcon icon={faBriefcase} style={{ color: 'var(--primary)' }} />
            <span>{doctor.experienceYears} Years Exp.</span>
          </div>
          <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.05rem' }}>
            ${doctor.fees}
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-light)' }}>
              /visit
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <Link to={`/doctors/${doctor._id}`} className="btn btn-outline btn-sm">
            View Profile
          </Link>
          <Link
            to={`/book-appointment?doctor=${doctor._id}`}
            className="btn btn-primary btn-sm"
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;

