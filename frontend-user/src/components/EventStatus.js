import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import "./EventStatus.css";

const EVENT_STATUS = gql`
  query EventStatus($event_id: Int!) {
    eventStatus(event_id: $event_id) {
      event_id
      nama_event
      status_approval
      catatan
    }
  }
`;

export default function EventStatus() {
  const [eventId, setEventId] = useState("");
  const [getStatus, { data, loading, error }] = useLazyQuery(EVENT_STATUS, {
    context: { clientName: 'eventStatus' }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (eventId.trim()) {
      getStatus({ variables: { event_id: parseInt(eventId) } });
    }
  };

  return (
    <div className="user-event-status-container">
      <div className="user-event-status-card">
        <h2 className="user-event-status-title">Cek Status Event</h2>
        <p className="status-info">Masukkan ID event untuk melihat status pengajuan event Anda</p>
        
        <form onSubmit={handleSubmit} className="user-event-status-form">
          <div className="form-group">
            <label htmlFor="eventId">ID Event</label>
            <div className="user-input-with-button">
              <input
                id="eventId"
                className="user-form-input"
                placeholder="Masukkan ID event"
                value={eventId}
                onChange={e => setEventId(e.target.value)}
                type="number"
                required
              />
              <button 
                type="submit" 
                className="user-check-button"
                disabled={loading || !eventId.trim()}
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

        {data && data.eventStatus && (
          <div className="user-status-result">
            <h3>Detail Event</h3>
            <div className="user-event-details">
              <div className="user-detail-item">
                <span className="user-detail-label">Nama Event:</span>
                <span className="user-detail-value">{data.eventStatus.nama_event}</span>
              </div>
              <div className="user-detail-item">
                <span className="user-detail-label">ID Event:</span>
                <span className="user-detail-value">{data.eventStatus.event_id}</span>
              </div>
              <div className="user-detail-item">
                <span className="user-detail-label">Status:</span>
                <span className={`user-status-badge ${data.eventStatus.status_approval.toLowerCase()}`}>
                  {data.eventStatus.status_approval === 'approved' ? 'Disetujui' : 
                   data.eventStatus.status_approval === 'rejected' ? 'Ditolak' : 
                   'Menunggu Persetujuan'}
                </span>
              </div>
              {data.eventStatus.catatan && (
                <div className="user-detail-item user-detail-note">
                  <span className="user-detail-label">Catatan dari Ditmawa:</span>
                  <span className="user-detail-value user-note-text">{data.eventStatus.catatan}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 