import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import DoctorCard from '../components/DoctorCard';
import Loader from '../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes, faUserMd } from '@fortawesome/free-solid-svg-icons';

const SPECIALIZATIONS = [
  'All',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Psychiatry',
  'General Medicine',
  'ENT Specialist'
];

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedSpecialty !== 'All') params.specialization = selectedSpecialty;

      const res = await axiosClient.get('/doctors', { params });
      if (res.data && res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedSpecialty('All');
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
        <span className="badge badge-pill" style={{ marginBottom: '0.6rem' }}>
          Directory
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>
          Find Medical Specialists
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Explore our certified physician team, review clinical experience, and schedule your appointment with confidence.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div
        className="card"
        style={{
          marginBottom: '2.5rem',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by doctor name, specialty, or expertise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faSearch} />
            Search
          </button>

          {(search || selectedSpecialty !== 'All') && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn btn-secondary"
            >
              <FontAwesomeIcon icon={faTimes} />
              Reset
            </button>
          )}
        </form>

        {/* Specialization Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
            <FontAwesomeIcon icon={faFilter} /> Specialty:
          </span>
          {SPECIALIZATIONS.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              style={{
                border: 'none',
                cursor: 'pointer',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem',
                fontWeight: 600,
                transition: 'var(--transition)',
                backgroundColor: selectedSpecialty === spec ? 'var(--primary)' : 'var(--bg-alt)',
                color: selectedSpecialty === spec ? '#ffffff' : 'var(--text-main)'
              }}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          fontSize: '0.925rem',
          color: 'var(--text-muted)'
        }}
      >
        <span>
          Showing <strong>{doctors.length}</strong> available specialist{doctors.length === 1 ? '' : 's'}
        </span>
        {selectedSpecialty !== 'All' && (
          <span>
            Filtered by: <strong>{selectedSpecialty}</strong>
          </span>
        )}
      </div>

      {/* Doctors Grid / Loading / Empty States */}
      {loading ? (
        <Loader message="Loading doctor directory..." />
      ) : doctors.length > 0 ? (
        <div className="grid-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            backgroundColor: '#ffffff'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              margin: '0 auto 1.25rem'
            }}
          >
            <FontAwesomeIcon icon={faUserMd} />
          </div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
            No Doctors Found
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.925rem' }}>
            We could not find any doctors matching your search filters. Try clearing your filters or searching a different term.
          </p>
          <button onClick={handleClearFilters} className="btn btn-primary">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Doctors;

