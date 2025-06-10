import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "./EventApproval.css";

const APPROVE_EVENT = gql`
  mutation ApproveEvent($input: ApproveEventInput!) {
    approveEvent(input: $input) {
      event_id
      nama_event
      status_approval
    }
  }
`;

export default function EventApproval() {
  const [form, setForm] = useState({ event_id: "", status_approval: "approved", catatan: "" });
  const [approveEvent, { data, loading, error }] = useMutation(APPROVE_EVENT, {
    context: { clientName: 'approveEvent' }
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    approveEvent({ variables: { input: { ...form, event_id: parseInt(form.event_id) } } });
  };

  return (
    <div className="event-approval-container">
      <div className="event-approval-card">
        <h2 className="event-approval-title">Persetujuan Event</h2>
        <form onSubmit={handleSubmit} className="event-approval-form">
          <div className="form-group">
            <label htmlFor="event_id">ID Event</label>
            <input
              id="event_id"
              name="event_id"
              className="form-input"
              placeholder="Masukkan ID event"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status_approval">Status Persetujuan</label>
            <select
              id="status_approval"
              name="status_approval"
              className="form-input"
              onChange={handleChange}
              value={form.status_approval}
            >
              <option value="approved">Setujui Event</option>
              <option value="rejected">Tolak Event</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="catatan">Catatan</label>
            <textarea
              id="catatan"
              name="catatan"
              className="form-input"
              placeholder="Tambahkan catatan (opsional)"
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button 
            type="submit" 
            className={`submit-button ${form.status_approval === 'approved' ? 'approve' : 'reject'}`}
            disabled={loading}
          >
            {loading ? "Memproses..." : form.status_approval === 'approved' ? "Setujui Event" : "Tolak Event"}
          </button>
        </form>

        {data && (
          <div className={`status-message ${data.approveEvent.status_approval}`}>
            <h3>Status Event Diperbarui</h3>
            <div className="event-status-details">
              <p><strong>ID Event:</strong> {data.approveEvent.event_id}</p>
              <p><strong>Nama Event:</strong> {data.approveEvent.nama_event}</p>
              <p><strong>Status:</strong> 
                <span className={`status-badge ${data.approveEvent.status_approval}`}>
                  {data.approveEvent.status_approval === 'approved' ? 'Disetujui' : 'Ditolak'}
                </span>
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}