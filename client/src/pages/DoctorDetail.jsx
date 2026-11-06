import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faBriefcase,
  faCalendarAlt,
  faClock,
  faCalendarCheck,
  faUserMd,
  faCommentAlt,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

const DoctorDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review submission state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDoctorAndReviews = async () => {
      try {
        const [docRes, revRes] = await Promise.all([
          axiosClient.get(`/doctors/${id}`),
          axiosClient.get(`/reviews/doctor/${id}`)
        ]);

        if (docRes.data && docRes.data.success) {
          setDoctor(docRes.data.doctor);
        }
        if (revRes.data && revRes.data.success) {
          setReviews(revRes.data.reviews);
        }
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        toast.error('Failed to load doctor profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warning('Please enter a feedback comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await axiosClient.post('/reviews', {
        doctorId: id,
        rating: Number(rating),
        comment: comment.trim()
      });

      if (res.data && res.data.success) {
        toast.success('Thank you! Your review has been submitted.');
        setComment('');
        // Refresh reviews
        const revRes = await axiosClient.get(`/reviews/doctor/${id}`);
        if (revRes.data && revRes.data.success) {
          setReviews(revRes.data.reviews);
        }
        // Refresh doctor rating
        const docRes = await axiosClient.get(`/doctors/${id}`);
        if (docRes.data && docRes.data.success) {
          setDoctor(docRes.data.doctor);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <Loader message="Loading doctor profile and credentials..." />;
  }

  if (!doctor) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2>Doctor Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          The requested medical specialist could not be located.
        </p>
        <Link to="/doctors" className="btn btn-primary">
          Back to Doctors Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link> &gt;{' '}
        <Link to="/doctors" style={{ color: 'var(--primary)' }}>Doctors</Link> &gt;{' '}
        <span>{doctor.name}</span>
      </div>

      {/* Main Profile Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: '2.5rem',
          alignItems: 'start',
          marginBottom: '3rem'
        }}
      >
        {/* Left Column: Image & Direct Booking CTA */}
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div
            style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              backgroundColor: '#e2e8f0',
              aspectRatio: '1/1'
            }}
          >
            <img
              src={doctor.image || 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor'}
              alt={doctor.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/400x400/0284c7/ffffff?text=Doctor';
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: '#d97706',
              fontSize: '1.15rem',
              fontWeight: 700,
              marginBottom: '0.75rem'
            }}
          >
            <FontAwesomeIcon icon={faStar} />
            <span>{doctor.rating ? doctor.rating.toFixed(1) : '5.0'} / 5.0</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              ({doctor.reviewsCount || 0} reviews)
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-alt)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Consultation Fee
            </span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent)' }}>
              ${doctor.fees}
            </span>
          </div>

          <Link
            to={`/book-appointment?doctor=${doctor._id}`}
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            Book Consultation
          </Link>
        </div>

        {/* Right Column: Doctor Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-pill">
                <FontAwesomeIcon icon={faUserMd} /> {doctor.specialization}
              </span>
              <span className="badge badge-confirmed">
                <FontAwesomeIcon icon={faShieldAlt} /> Verified Board Certified
              </span>
            </div>

            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>{doctor.name}</h1>
            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              Senior Medical Specialist • {doctor.experienceYears} Years Clinical Experience
            </p>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Clinical Profile & Biography</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.975rem', marginBottom: '1.75rem' }}>
              {doctor.bio}
            </p>

            {/* Practice Schedule */}
            <div
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: '1.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                  <FontAwesomeIcon icon={faCalendarAlt} style={{ color: 'var(--primary)' }} />
                  Available Days
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {doctor.availability?.days?.map((d) => (
                    <span
                      key={d}
                      style={{
                        backgroundColor: 'var(--bg-alt)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                  <FontAwesomeIcon icon={faClock} style={{ color: 'var(--accent)' }} />
                  Consultation Slots
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {doctor.availability?.timeSlots?.map((s) => (
                    <span
                      key={s}
                      style={{
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FontAwesomeIcon icon={faCommentAlt} style={{ color: 'var(--primary)' }} />
              Patient Feedback & Reviews ({reviews.length})
            </h3>

            {/* Submit Review Form (if logged in) */}
            {user ? (
              <form
                onSubmit={handleReviewSubmit}
                style={{
                  backgroundColor: 'var(--bg-alt)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '2rem'
                }}
              >
                <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
                  Share Your Consultation Experience
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Your Rating:
                  </label>
                  <select
                    className="form-select"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    style={{ width: 'auto', padding: '0.4rem 0.8rem' }}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                    <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value="3">⭐⭐⭐ (3 - Average)</option>
                    <option value="2">⭐⭐ (2 - Below Average)</option>
                    <option value="1">⭐ (1 - Needs Improvement)</option>
                  </select>
                </div>

                <div className="form-group">
                  <textarea
                    className="form-textarea"
                    placeholder="Write your honest comments regarding diagnosis, communication, and care..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="3"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div
                style={{
                  backgroundColor: 'var(--primary-light)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--primary)'
                }}
              >
                <strong>Have you visited this doctor?</strong>{' '}
                <Link to="/login" style={{ textDecoration: 'underline', fontWeight: 700 }}>
                  Log in to leave a review
                </Link>
                .
              </div>
            )}

            {/* List of reviews */}
            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      paddingBottom: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {rev.user?.name || 'Verified Patient'}
                      </div>
                      <div style={{ color: '#d97706', fontSize: '0.85rem' }}>
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <FontAwesomeIcon key={i} icon={faStar} />
                        ))}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                      {rev.comment}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.35rem', display: 'block' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                No patient reviews submitted yet. Be the first to share your experience!
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          div[style*="grid-template-columns: 340px 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DoctorDetail;

