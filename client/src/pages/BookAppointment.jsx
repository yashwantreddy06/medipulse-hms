import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faUserMd,
  faCalendarAlt,
  faClock,
  faNotesMedical,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Today's minimum selectable date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosClient.get('/doctors');
        if (res.data && res.data.success) {
          setDoctors(res.data.doctors);

          const preselectedId = searchParams.get('doctor');
          if (preselectedId) {
            setSelectedDoctorId(preselectedId);
            const found = res.data.doctors.find((d) => d._id === preselectedId);
            setSelectedDoctor(found || null);
            if (found && found.availability?.timeSlots?.length > 0) {
              setTimeSlot(found.availability.timeSlots[0]);
            }
          } else if (res.data.doctors.length > 0) {
            setSelectedDoctorId(res.data.doctors[0]._id);
            setSelectedDoctor(res.data.doctors[0]);
            if (res.data.doctors[0].availability?.timeSlots?.length > 0) {
              setTimeSlot(res.data.doctors[0].availability.timeSlots[0]);
            }
          }
        }
      } catch (err) {
        toast.error('Failed to load doctors list for appointment booking.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [searchParams]);

  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    setSelectedDoctorId(docId);
    const found = doctors.find((d) => d._id === docId);
    setSelectedDoctor(found || null);
    if (found && found.availability?.timeSlots?.length > 0) {
      setTimeSlot(found.availability.timeSlots[0]);
    } else {
      setTimeSlot('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctorId) {
      toast.warning('Please select a doctor.');
      return;
    }
    if (!date) {
      toast.warning('Please select a consultation date.');
      return;
    }
    if (!timeSlot) {
      toast.warning('Please select a time slot.');
      return;
    }
    if (!reason.trim()) {
      toast.warning('Please provide a reason for consultation.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosClient.post('/appointments', {
        doctorId: selectedDoctorId,
        date,
        timeSlot,
        reason: reason.trim()
      });

      if (res.data && res.data.success) {
        toast.success('Appointment booked successfully! Our medical team will review it.');
        navigate('/my-appointments');
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading appointment scheduling form..." />;
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-pill" style={{ marginBottom: '0.6rem' }}>
            Schedule Consultation
          </span>
          <h1 style={{ fontSize: '2.3rem', marginBottom: '0.6rem' }}>
            Book Your Doctor Appointment
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Choose your preferred physician, available day, and slot. Instant confirmation tracking.
          </p>
        </div>

        <div className="card" style={{ padding: '2.25rem', boxShadow: 'var(--shadow-md)' }}>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Select Doctor */}
            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon={faUserMd} style={{ color: 'var(--primary)', marginRight: '6px' }} />
                Select Medical Specialist
              </label>
              <select
                className="form-select"
                value={selectedDoctorId}
                onChange={handleDoctorChange}
                required
              >
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} — {doc.specialization} (${doc.fees} / visit)
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Doctor Summary Preview */}
            {selectedDoctor && (
              <div
                style={{
                  backgroundColor: 'var(--bg-alt)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border)'
                }}
              >
                <img
                  src={selectedDoctor.image || 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor'}
                  alt={selectedDoctor.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor';
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedDoctor.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {selectedDoctor.specialization} • {selectedDoctor.experienceYears} Years Exp.
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Fee</div>
                  <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.1rem' }}>
                    ${selectedDoctor.fees}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Date & Slot Pickers */}
            <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  <FontAwesomeIcon icon={faCalendarAlt} style={{ color: 'var(--primary)', marginRight: '6px' }} />
                  Consultation Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  <FontAwesomeIcon icon={faClock} style={{ color: 'var(--accent)', marginRight: '6px' }} />
                  Preferred Time Slot
                </label>
                <select
                  className="form-select"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  required
                >
                  {selectedDoctor?.availability?.timeSlots?.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  )) || (
                    <>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Step 3: Reason for Consultation */}
            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon={faNotesMedical} style={{ color: 'var(--primary)', marginRight: '6px' }} />
                Reason for Visit & Medical Symptoms
              </label>
              <textarea
                className="form-textarea"
                placeholder="Briefly describe your symptoms, health concerns, or consultation goals..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="4"
                required
              ></textarea>
            </div>

            {/* Patient Info Confirmation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '1.75rem'
              }}
            >
              <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#16a34a' }} />
              <span>
                Booking as: <strong>{user?.name}</strong> ({user?.email})
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                disabled={submitting}
              >
                <FontAwesomeIcon icon={faCalendarCheck} />
                {submitting ? 'Confirming Appointment...' : 'Confirm & Book Appointment'}
              </button>
              <Link to="/doctors" className="btn btn-secondary btn-lg">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;

