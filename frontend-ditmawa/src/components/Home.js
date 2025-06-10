import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const features = [
    {
      title: 'Persetujuan Event',
      description: 'Kelola persetujuan event yang diajukan',
      path: '/event-approval',
      icon: '✅'
    },
    {
      title: 'Event Detail',
      description: 'Melihat detail event yang diajukan',
      path: '/event-detail',
      icon: '📢'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Selamat Datang di Sistem Kemahasiswaan</h1>
        <p className="home-description">
          Kelola event dan booking ruangan kampus dengan mudah dan efisien
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <Link 
              key={index} 
              to={feature.path} 
              className="feature-card"
            >
              <div className="feature-icon">{feature.icon}</div>
              <h2 className="feature-title">{feature.title}</h2>
              <p className="feature-description">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 