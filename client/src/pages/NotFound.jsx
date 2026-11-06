import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartBroken, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 220px)',
        textAlign: 'center',
        padding: '4rem 1.25rem'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          marginBottom: '1.5rem'
        }}
      >
        <FontAwesomeIcon icon={faHeartBroken} />
      </div>

      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
        Page Not Found
      </h2>
      <p style={{ maxWidth: '480px', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        The healthcare resource or clinical page you are looking for might have been moved, renamed, or is temporarily unavailable.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          <FontAwesomeIcon icon={faHome} />
          Return to Home
        </Link>
        <Link to="/doctors" className="btn btn-outline">
          <FontAwesomeIcon icon={faSearch} />
          Find Doctors
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

