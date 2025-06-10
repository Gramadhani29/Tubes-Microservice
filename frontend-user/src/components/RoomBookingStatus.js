import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import "./RoomBookingStatus.css";

const ROOM_BOOKING_STATUS = gql`
  query RoomBookingStatus($bookingId: Int!) {
    roomBookingStatus(booking_id: $bookingId) {
      booking_id
      status_booking
      tanggal_update
    }
  }
`;

export default function RoomBookingStatus() {
  const [bookingId, setBookingId] = useState("");
  const [getStatus, { data, loading, error }] = useLazyQuery(ROOM_BOOKING_STATUS);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookingId.trim()) {
      getStatus({ variables: { bookingId: parseInt(bookingId) } });
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="user-room-booking-container">
      <div className="user-room-booking-card">
        <h2 className="user-room-booking-title">Status Booking Ruangan</h2>
        <p className="booking-info">Masukkan ID booking untuk melihat status pemesanan ruangan Anda</p>
        
        <form onSubmit={handleSubmit} className="user-room-booking-form">
          <div className="form-group">
            <label htmlFor="bookingId">ID Booking</label>
            <div className="user-input-with-button">
              <input
                id="bookingId"
                className="user-form-input"
                placeholder="Masukkan ID booking"
                value={bookingId}
                onChange={e => setBookingId(e.target.value)}
                type="number"
                required
              />
              <button 
                type="submit" 
                className="user-check-button"
                disabled={loading || !bookingId.trim()}
              >
                {loading ? (
                  <span className="user-loading-spinner"></span>
                ) : (
                  "Cek Status"
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="user-error-message">
            <p>{error.message}</p>
          </div>
        )}

        {data && data.roomBookingStatus && (
          <div className="user-booking-status-result">
            <h3>Detail Booking</h3>
            <div className="user-booking-details">
              <div className="user-detail-item">
                <span className="user-detail-label">ID Booking:</span>
                <span className="user-detail-value">{data.roomBookingStatus.booking_id}</span>
              </div>
              <div className="user-detail-item">
                <span className="user-detail-label">Status:</span>
                <span className={`user-status-badge ${data.roomBookingStatus.status_booking.toLowerCase()}`}>
                  {data.roomBookingStatus.status_booking === 'approved' ? 'Disetujui' : 
                   data.roomBookingStatus.status_booking === 'rejected' ? 'Ditolak' : 
                   'Menunggu Persetujuan'}
                </span>
              </div>
              <div className="user-detail-item">
                <span className="user-detail-label">Terakhir Diperbarui:</span>
                <span className="user-detail-value">{formatDate(data.roomBookingStatus.tanggal_update)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 