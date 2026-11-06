import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserShield,
  faUserMd,
  faCalendarCheck,
  faClock,
  faPlus,
  faEdit,
  faTrash,
  faCheck,
  faBan,
  faFlagCheckered,
  faDollarSign
} from '@fortawesome/free-solid-svg-icons';

const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Psychiatry',
  'General Medicine',
  'ENT Specialist'
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' or 'appointments'
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Doctor Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: 'Cardiology',
    experienceYears: '',
    fees: '',
    image: '',
    bio: '',
    days: 'Monday, Wednesday, Friday',
    timeSlots: '09:00 AM, 11:00 AM, 02:00 PM, 04:00 PM'
  });
  const [submittingDoctor, setSubmittingDoctor] = useState(false);

  // Appointments filter
  const [appointmentFilter, setAppointmentFilter] = useState('all');

  // Load both doctors and appointments
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [docRes, appRes] = await Promise.all([
        axiosClient.get('/doctors'),
        axiosClient.get('/appointments')
      ]);

      if (docRes.data && docRes.data.success) {
        setDoctors(docRes.data.doctors);
      }
      if (appRes.data && appRes.data.success) {
        setAppointments(appRes.data.appointments);
      }
    } catch (err) {
      toast.error('Failed to load administrative records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Modal open for create
  const handleOpenCreateDoctor = () => {
    setEditingDoctor(null);
    setDoctorForm({
      name: '',
      specialization: 'Cardiology',
      experienceYears: '',
      fees: '',
      image: 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor',
      bio: '',
      days: 'Monday, Wednesday, Friday',
      timeSlots: '09:00 AM, 11:00 AM, 02:00 PM, 04:00 PM'
    });
    setIsModalOpen(true);
  };

  // Modal open for edit
  const handleOpenEditDoctor = (doc) => {
    setEditingDoctor(doc);
    setDoctorForm({
      name: doc.name,
      specialization: doc.specialization,
      experienceYears: doc.experienceYears,
      fees: doc.fees,
      image: doc.image || '',
      bio: doc.bio,
      days: doc.availability?.days?.join(', ') || 'Monday, Wednesday, Friday',
      timeSlots: doc.availability?.timeSlots?.join(', ') || '09:00 AM, 11:00 AM, 02:00 PM'
    });
    setIsModalOpen(true);
  };

  const handleSaveDoctor = async (e) => {
    e.preventDefault();
    setSubmittingDoctor(true);

    const payload = {
      name: doctorForm.name,
      specialization: doctorForm.specialization,
      experienceYears: Number(doctorForm.experienceYears),
      fees: Number(doctorForm.fees),
      image: doctorForm.image || 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor',
      bio: doctorForm.bio,
      availability: {
        days: doctorForm.days.split(',').map((d) => d.trim()).filter(Boolean),
        timeSlots: doctorForm.timeSlots.split(',').map((s) => s.trim()).filter(Boolean)
      }
    };

    try {
      if (editingDoctor) {
        // Update
        const res = await axiosClient.put(`/doctors/${editingDoctor._id}`, payload);
        if (res.data && res.data.success) {
          toast.success('Doctor profile updated successfully.');
          setDoctors((prev) =>
            prev.map((d) => (d._id === editingDoctor._id ? res.data.doctor : d))
          );
        }
      } else {
        // Create
        const res = await axiosClient.post('/doctors', payload);
        if (res.data && res.data.success) {
          toast.success('Doctor profile created successfully.');
          setDoctors((prev) => [res.data.doctor, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save doctor.');
    } finally {
      setSubmittingDoctor(false);
    }
  };

  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name} from the medical roster?`)) {
      return;
    }

    try {
      const res = await axiosClient.delete(`/doctors/${id}`);
      if (res.data && res.data.success) {
        toast.info('Doctor profile deleted.');
        setDoctors((prev) => prev.filter((d) => d._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete doctor.');
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await axiosClient.put(`/appointments/${appId}/status`, {
        status: newStatus
      });

      if (res.data && res.data.success) {
        toast.success(`Appointment status updated to "${newStatus}".`);
        setAppointments((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (appointmentFilter === 'all') return true;
    return a.status === appointmentFilter;
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
        return <span className="badge badge-pending">Pending</span>;
    }
  };

  if (loading) {
    return <Loader message="Accessing administrative control panel..." />;
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className="badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <FontAwesomeIcon icon={faUserShield} /> Admin Management Console
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', margin: 0 }}>System Operations Dashboard</h1>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
              fontSize: '1.25rem'
            }}
          >
            <FontAwesomeIcon icon={faUserMd} />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Doctors</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{doctors.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
              fontSize: '1.25rem'
            }}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Appointments</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{appointments.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
              fontSize: '1.25rem'
            }}
          >
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Triage</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {appointments.filter((a) => a.status === 'pending').length}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#dcfce7',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Confirmed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {appointments.filter((a) => a.status === 'confirmed').length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '2px solid var(--border)',
          marginBottom: '2rem'
        }}
      >
        <button
          onClick={() => setActiveTab('doctors')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            borderBottom: activeTab === 'doctors' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'doctors' ? 'var(--primary)' : 'var(--text-muted)',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FontAwesomeIcon icon={faUserMd} />
          Doctors Management ({doctors.length})
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            borderBottom: activeTab === 'appointments' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'appointments' ? 'var(--primary)' : 'var(--text-muted)',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FontAwesomeIcon icon={faCalendarCheck} />
          Appointments Central ({appointments.length})
        </button>
      </div>

      {/* TAB 1: DOCTORS MANAGEMENT */}
      {activeTab === 'doctors' && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.925rem' }}>
              Create, edit, or remove certified physicians and configure consultation fees.
            </p>
            <button onClick={handleOpenCreateDoctor} className="btn btn-primary">
              <FontAwesomeIcon icon={faPlus} />
              Add New Doctor
            </button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Doctor</th>
                    <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Specialization</th>
                    <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Experience</th>
                    <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Fee</th>
                    <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Rating</th>
                    <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <tr key={doc._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.9rem 1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={doc.image || 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor'}
                            alt={doc.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor';
                            }}
                          />
                          <span style={{ fontWeight: 600 }}>{doc.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.9rem 1.2rem' }}>
                        <span className="badge badge-pill">{doc.specialization}</span>
                      </td>
                      <td style={{ padding: '0.9rem 1.2rem', color: 'var(--text-muted)' }}>
                        {doc.experienceYears} Years
                      </td>
                      <td style={{ padding: '0.9rem 1.2rem', fontWeight: 700, color: 'var(--accent)' }}>
                        ${doc.fees}
                      </td>
                      <td style={{ padding: '0.9rem 1.2rem' }}>
                        ⭐ {doc.rating ? doc.rating.toFixed(1) : '5.0'}
                      </td>
                      <td style={{ padding: '0.9rem 1.2rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenEditDoctor(doc)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Doctor"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(doc._id, doc.name)}
                            className="btn btn-danger btn-sm"
                            title="Delete Doctor"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPOINTMENTS MANAGEMENT */}
      {activeTab === 'appointments' && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.925rem' }}>
              Review patient appointment requests and update consultation statuses.
            </p>

            {/* Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Filter:</span>
              <select
                className="form-select"
                value={appointmentFilter}
                onChange={(e) => setAppointmentFilter(e.target.value)}
                style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
              >
                <option value="all">All Appointments</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Patient</th>
                    <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Doctor</th>
                    <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Schedule</th>
                    <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Reason</th>
                    <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '0.9rem 1.2rem', fontWeight: 700, textAlign: 'right' }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((app) => (
                      <tr key={app._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.9rem 1.2rem' }}>
                          <div style={{ fontWeight: 600 }}>{app.user?.name || 'Patient'}</div>
                          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                            {app.user?.email || 'N/A'}
                          </div>
                        </td>
                        <td style={{ padding: '0.9rem 1.2rem' }}>
                          <div style={{ fontWeight: 600 }}>{app.doctor?.name || 'Doctor'}</div>
                          <div style={{ fontSize: '0.785rem', color: 'var(--primary)' }}>
                            {app.doctor?.specialization || 'General'}
                          </div>
                        </td>
                        <td style={{ padding: '0.9rem 1.2rem' }}>
                          <div>{app.date}</div>
                          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                            {app.timeSlot}
                          </div>
                        </td>
                        <td style={{ padding: '0.9rem 1.2rem', maxWidth: '240px' }}>
                          <span style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>
                            {app.reason}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1.2rem' }}>
                          {getStatusBadge(app.status)}
                        </td>
                        <td style={{ padding: '0.9rem 1.2rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                            {app.status !== 'confirmed' && (
                              <button
                                onClick={() => handleUpdateStatus(app._id, 'confirmed')}
                                className="btn btn-sm"
                                style={{ backgroundColor: '#16a34a', color: '#fff' }}
                                title="Confirm Appointment"
                              >
                                <FontAwesomeIcon icon={faCheck} /> Confirm
                              </button>
                            )}
                            {app.status !== 'completed' && (
                              <button
                                onClick={() => handleUpdateStatus(app._id, 'completed')}
                                className="btn btn-sm"
                                style={{ backgroundColor: '#4f46e5', color: '#fff' }}
                                title="Mark Completed"
                              >
                                <FontAwesomeIcon icon={faFlagCheckered} /> Complete
                              </button>
                            )}
                            {app.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateStatus(app._id, 'cancelled')}
                                className="btn btn-danger btn-sm"
                                title="Cancel Appointment"
                              >
                                <FontAwesomeIcon icon={faBan} /> Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No appointments found matching this status filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DOCTOR CREATE / EDIT */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoctor ? 'Edit Doctor Profile' : 'Register New Medical Specialist'}
      >
        <form onSubmit={handleSaveDoctor}>
          <div className="form-group">
            <label className="form-label">Full Doctor Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Rajesh Sharma"
              value={doctorForm.name}
              onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <select
                className="form-select"
                value={doctorForm.specialization}
                onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                required
              >
                {SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input
                type="number"
                min="0"
                className="form-input"
                placeholder="e.g. 12"
                value={doctorForm.experienceYears}
                onChange={(e) => setDoctorForm({ ...doctorForm, experienceYears: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Consultation Fee ($ USD)</label>
              <input
                type="number"
                min="0"
                className="form-input"
                placeholder="e.g. 95"
                value={doctorForm.fees}
                onChange={(e) => setDoctorForm({ ...doctorForm, fees: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Avatar / Image URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://placehold.co/400x400/..."
                value={doctorForm.image}
                onChange={(e) => setDoctorForm({ ...doctorForm, image: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Practicing Days (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Monday, Wednesday, Friday"
              value={doctorForm.days}
              onChange={(e) => setDoctorForm({ ...doctorForm, days: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Available Time Slots (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="09:00 AM, 11:00 AM, 02:00 PM, 04:00 PM"
              value={doctorForm.timeSlots}
              onChange={(e) => setDoctorForm({ ...doctorForm, timeSlots: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Doctor Biography & Credentials</label>
            <textarea
              className="form-textarea"
              placeholder="Detailed description of medical training, board certification, and clinical focus..."
              value={doctorForm.bio}
              onChange={(e) => setDoctorForm({ ...doctorForm, bio: e.target.value })}
              rows="3"
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingDoctor}
            >
              {submittingDoctor ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Create Doctor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

