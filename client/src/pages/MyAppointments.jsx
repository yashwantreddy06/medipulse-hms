import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCalendarAlt,
  faClock,
  faUserMd,
  faBan,
  faCheckCircle,
  faInfoCircle,
  faDollarSign
} from '@fortawesome/free-solid-svg-icons';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await axiosClient.get('/appointments/mine');
      if (res.data && res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      toast.error('Failed to load your appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setCancellingId(id);
    try {
      const res = await axiosClient.put(`/appointments/${id}/status`, {
        status: 'cancelled'
      });

      if (res.data && res.data.success) {
        toast.info('Appointment has been cancelled.');
        // Update local state
        setAppointments((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status: 'cancelled' } : app))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-confirmed">Confirmed</span>;
      case 'completed':
        return <span className="badge badge-completed">Completed</span>;
      case 'cancelled':
        return <span className="badge badge-cancelled">Cancelled</span>;
      case 'pending':
      default:
        return <span className="badge badge-pending">Pending Review</span>;
    }
  };

  if (loading) {
    return <Loader message="Fetching your appointment history..." />;
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          gap: '1rem'
        }}
      >
        <div>
          <span className="badge badge-pill" style={{ marginBottom: '0.4rem' }}>
            Patient Dashboard
          </span>
          <h1 style={{ fontSize: '2.2rem', margin: 0 }}>My Health Appointments</h1>
        </div>
        <Link to="/book-appointment" className="btn btn-primary">
          <FontAwesomeIcon icon={faCalendarCheck} />
          Book New Consultation
        </Link>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.75rem'
        }}
      >
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              borderRadius: 'var(--radius-md)',
              textTransform: 'capitalize',
              transition: 'var(--transition)',
              backgroundColor: filter === tab ? 'var(--primary)' : 'transparent',
              color: filter === tab ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            {tab} ({tab === 'all' ? appointments.length : appointments.filter((a) => a.status === tab).length})
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredAppointments.map((app) => (
            <div
              key={app._id}
              className="card card-hover"
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '1.5rem',
                alignItems: 'center',
                padding: '1.5rem'
              }}
            >
              {/* Doctor Avatar */}
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  backgroundColor: '#e2e8f0'
                }}
              >
                <img
                  src={app.doctor?.image || 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor'}
                  alt={app.doctor?.name || 'Doctor'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor';
                  }}
                />
              </div>

              {/* Appointment Content */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                    {app.doctor?.name || 'Doctor Consultation'}
                  </h3>
                  <span className="badge badge-pill">
                    <FontAwesomeIcon icon={faUserMd} /> {app.doctor?.specialization || 'Specialist'}
                  </span>
                  {getStatusBadge(app.status)}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    marginBottom: '0.6rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ color: 'var(--primary)' }} />
                    <strong>Date:</strong> {app.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FontAwesomeIcon icon={faClock} style={{ color: 'var(--accent)' }} />
                    <strong>Slot:</strong> {app.timeSlot}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FontAwesomeIcon icon={faDollarSign} style={{ color: '#16a34a' }} />
                    <strong>Fee:</strong> ${app.doctor?.fees || 0}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-main)',
                    backgroundColor: 'var(--bg-alt)',
                    padding: '0.6rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    margin: 0
                  }}
                >
                  <strong>Reason:</strong> {app.reason}
                </p>
              </div>

              {/* Action Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '130px' }}>
                {app.status === 'pending' || app.status === 'confirmed' ? (
                  <button
                    onClick={() => handleCancelAppointment(app._id)}
                    className="btn btn-danger btn-sm"
                    disabled={cancellingId === app._id}
                  >
                    <FontAwesomeIcon icon={faBan} />
                    {cancellingId === app._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}>
                    {app.status === 'completed' ? 'Session completed' : 'Booking cancelled'}
                  </span>
                )}
                {app.doctor?._id && (
                  <Link to={`/doctors/${app.doctor._id}`} className="btn btn-outline btn-sm">
                    Doctor Profile
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
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
            <FontAwesomeIcon icon={faCalendarCheck} />
          </div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
            No Appointments Found
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.925rem' }}>
            {filter === 'all'
              ? "You haven't scheduled any doctor appointments yet."
              : `You have no appointments with status "${filter}".`}
          </p>
          <Link to="/book-appointment" className="btn btn-primary">
            Schedule Your First Consultation
          </Link>
        </div>
      )}

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 768px) {
          .card[style*="grid-template-columns: auto 1fr auto"] {
            grid-template-columns: 1fr !important;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default MyAppointments;

