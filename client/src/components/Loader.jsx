import React from 'react';

const Loader = ({ message = 'Loading, please wait...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
};

export default Loader;

