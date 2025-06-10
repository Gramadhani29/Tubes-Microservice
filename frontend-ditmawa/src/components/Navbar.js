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
            Sistem Kemahasiswaan
          </Link>
        </div>
        <div className="navbar-menu">
          <Link 
            to="/event-approval" 
            className={`nav-link ${isActive('/event-approval') ? 'active' : ''}`}
          >
            Persetujuan Event
          </Link>
          <Link 
            to="/event-detail" 
            className={`nav-link ${isActive('/event-detail') ? 'active' : ''}`}
          >
            Event Detail
          </Link>
        </div>
      </div>
    </nav>
  );
} 