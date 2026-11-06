import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeartbeat,
  faBars,
  faTimes,
  faUserCircle,
  faSignOutAlt,
  faUserShield,
  faCalendarAlt,
  faStethoscope
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '1.25rem',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
            }}
          >
            <FontAwesomeIcon icon={faHeartbeat} />
          </div>
          <div>
            <span
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--primary)',
                letterSpacing: '-0.5px'
              }}
            >
              Medi<span style={{ color: 'var(--text-main)' }}>Pulse</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.925rem',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'var(--transition)'
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/doctors"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.925rem',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'var(--transition)'
            })}
          >
            Find Doctors
          </NavLink>

          {user && (
            <NavLink
              to="/my-appointments"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              })}
            >
              <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '0.85rem' }} />
              My Appointments
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              })}
            >
              <FontAwesomeIcon icon={faUserShield} style={{ fontSize: '0.85rem' }} />
              Admin Portal
            </NavLink>
          )}
        </nav>

        {/* Desktop Actions */}
        <div
          className="desktop-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  backgroundColor: 'var(--bg-alt)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <FontAwesomeIcon
                  icon={isAdmin ? faUserShield : faUserCircle}
                  style={{ color: isAdmin ? 'var(--accent)' : 'var(--primary)' }}
                />
                <span>{user.name.split(' ')[0]}</span>
                {isAdmin && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      background: 'var(--accent-light)',
                      color: 'var(--accent)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log Out"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.4rem',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '0.4rem'
          }}
        >
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="mobile-dropdown"
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <NavLink
            to="/"
            onClick={closeMenu}
            style={{ fontWeight: 600, padding: '0.4rem 0' }}
          >
            Home
          </NavLink>
          <NavLink
            to="/doctors"
            onClick={closeMenu}
            style={{ fontWeight: 600, padding: '0.4rem 0' }}
          >
            Find Doctors
          </NavLink>
          {user && (
            <NavLink
              to="/my-appointments"
              onClick={closeMenu}
              style={{ fontWeight: 600, padding: '0.4rem 0' }}
            >
              My Appointments
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={closeMenu}
              style={{ fontWeight: 600, color: 'var(--accent)', padding: '0.4rem 0' }}
            >
              Admin Portal
            </NavLink>
          )}
          <div
            style={{
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            {user ? (
              <>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Signed in as: <strong>{user.name}</strong> ({user.role})
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="btn btn-outline btn-sm"
                  style={{ textAlign: 'center' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="btn btn-primary btn-sm"
                  style={{ textAlign: 'center' }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive CSS for Navbar */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav, .desktop-actions {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

