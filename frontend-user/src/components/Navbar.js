import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            User Portal
          </Link>
        </div>
        <div className="navbar-links">
          <Link 
            to="/submit-event" 
            className={`nav-link ${isActive('/submit-event') ? 'active' : ''}`}
          >
            Ajukan Event
          </Link>
          <Link 
            to="/event-status" 
            className={`nav-link ${isActive('/event-status') ? 'active' : ''}`}
          >
            Status Event
          </Link>
          <Link 
            to="/room-status" 
            className={`nav-link ${isActive('/room-status') ? 'active' : ''}`}
          >
            Status Ruangan
          </Link>
        </div>
      </div>
    </nav>
  );
} 