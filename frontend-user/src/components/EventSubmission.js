import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "./EventSubmission.css";

const SUBMIT_EVENT = gql`
  mutation SubmitEvent($input: SubmitEventInput!) {
    submitEvent(input: $input) {
      event_id
      nama_event
      status_approval
    }
  }
`;

export default function EventSubmission() {
  const [form, setForm] = useState({
    nama_event: "",
    deskripsi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
  });
  const [submitEvent, { data, loading, error }] = useMutation(SUBMIT_EVENT, {
    context: { clientName: 'submitEvent' }
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    submitEvent({ variables: { input: form } });
  };

  return (
    <div className="user-event-submission-container">
      <div className="user-event-submission-card">
        <h2 className="user-event-submission-title">Ajukan Event Baru</h2>
        <p className="submission-info">Silakan isi formulir di bawah ini untuk mengajukan event baru</p>
        
        <form onSubmit={handleSubmit} className="user-event-submission-form">
          <div className="form-group">
            <label htmlFor="nama_event">Nama Event</label>
            <input
              id="nama_event"
              name="nama_event"
              className="user-form-input"
              placeholder="Masukkan nama event"
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="deskripsi">Deskripsi Event</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              className="user-form-input"
              placeholder="Jelaskan detail event Anda"
              onChange={handleChange}
              required
              rows="4"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tanggal_mulai">Tanggal Mulai</label>
              <input
                id="tanggal_mulai"
                name="tanggal_mulai"
                type="date"
                className="user-form-input"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tanggal_selesai">Tanggal Selesai</label>
              <input
                id="tanggal_selesai"
                name="tanggal_selesai"
                type="date"
                className="user-form-input"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="user-submit-button"
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Ajukan Event"}
          </button>
        </form>

        {data && (
          <div className="user-success-message">
            <h3>Event Berhasil Diajukan!</h3>
            <div className="user-event-details">
              <p><strong>Nama Event:</strong> {data.submitEvent.nama_event}</p>
              <p><strong>ID Event:</strong> {data.submitEvent.event_id}</p>
              <p><strong>Status:</strong> 
                <span className={`user-status-badge ${data.submitEvent.status_approval.toLowerCase()}`}>
                  {data.submitEvent.status_approval === 'approved' ? 'Disetujui' : 
                   data.submitEvent.status_approval === 'rejected' ? 'Ditolak' : 
                   'Menunggu Persetujuan'}
                </span>
              </p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="user-error-message">
            <p>{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
} 