import React from "react";
import { useQuery, gql } from "@apollo/client";
import "./EventDetail.css";

const GET_ALL_EVENTS = gql`
  query GetAllEvents {
    allEvents {
      event_id
      nama_event
      deskripsi
      tanggal_mulai
      tanggal_selesai
      status_approval
    }
  }
`;

export default function EventDetail() {
  const { loading, error, data } = useQuery(GET_ALL_EVENTS, {
    context: { clientName: 'allEvents' }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="event-detail-container">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat data event...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="event-detail-container">
      <div className="error-message">
        <p>Error: {error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="event-detail-container">
      <div className="event-detail-card">
        <h2 className="event-detail-title">Daftar Event</h2>
        <p className="event-detail-description">
          Berikut adalah daftar semua event yang telah diajukan
        </p>

        <div className="table-container">
          <table className="event-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Event</th>
                <th>Deskripsi</th>
                <th>Tanggal Mulai</th>
                <th>Tanggal Selesai</th>
                <th>Status Approval</th>
              </tr>
            </thead>
            <tbody>
              {data.allEvents.map((event) => (
                <tr key={event.event_id}>
                  <td>{event.event_id}</td>
                  <td>{event.nama_event}</td>
                  <td className="description-cell">{event.deskripsi}</td>
                  <td>{formatDate(event.tanggal_mulai)}</td>
                  <td>{formatDate(event.tanggal_selesai)}</td>
                  <td>
                    <span className={`status-badge ${event.status_approval}`}>
                      {event.status_approval === 'approved' ? 'Disetujui' : 
                       event.status_approval === 'rejected' ? 'Ditolak' : 'Menunggu'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 