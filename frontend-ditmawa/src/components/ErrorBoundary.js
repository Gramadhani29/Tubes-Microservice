import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import './ErrorBoundary.css';

export default function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = 'Terjadi kesalahan yang tidak terduga.';
  let errorDetails = '';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || 'Halaman tidak ditemukan';
    errorDetails = error.data?.message || '';
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack;
  }

  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-title">Oops! 😕</h1>
        <p className="error-message">{errorMessage}</p>
        {errorDetails && (
          <pre className="error-details">
            {errorDetails}
          </pre>
        )}
        <Link to="/" className="error-button">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
} 