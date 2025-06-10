# Sistem Manajemen Event Kemahasiswaan

Sistem manajemen event kemahasiswaan adalah aplikasi web yang memungkinkan pengelolaan event kampus, booking ruangan, dan notifikasi logistik secara terintegrasi. Sistem ini terdiri dari backend GraphQL API (Python/Flask) dan frontend React.

## Fitur Utama

- 🎉 Pengajuan Event
- ✅ Persetujuan Event
- 📊 Status Event
- 🏢 Status Booking Ruangan
- 📢 Notifikasi Logistik

## Teknologi yang Digunakan

### Backend
- Python 3.8+
- Flask
- GraphQL (Ariadne)
- SQLAlchemy
- PostgreSQL

### Frontend
- React 18
- Apollo Client
- React Router v6
- CSS Modern

## Prasyarat

- Python 3.8 atau lebih baru
- Node.js 16 atau lebih baru
- npm 8 atau lebih baru
- PostgreSQL 12 atau lebih baru

## Instalasi

### 1. Clone Repository
```bash
git clone [URL_REPOSITORY]
cd [NAMA_FOLDER]
```

### 2. Backend Setup

1. Buat virtual environment Python:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies backend:
```bash
pip install -r requirements.txt
```

3. Konfigurasi Database:
- Buat database PostgreSQL baru
- Update konfigurasi database di `app.py`
- Jalankan migrasi database:
```bash
flask db upgrade
```

4. Jalankan backend server:
```bash
flask run
```
Server akan berjalan di `http://localhost:5000`

### 3. Frontend Setup

1. Masuk ke direktori frontend:
```bash
cd frontend-ditmawa
```

2. Install dependencies frontend:
```bash
npm install
```

3. Jalankan frontend development server:
```bash
npm start
```
Aplikasi akan berjalan di `http://localhost:3000`

## Struktur Proyek

```
.
├── app.py                 # Backend Flask application
├── requirements.txt       # Python dependencies
├── frontend-ditmawa/      # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── apolloClient.js # Apollo Client configuration
│   │   └── App.js        # Main React application
│   └── package.json      # Node.js dependencies
└── README.md             # Dokumentasi proyek
```

## Penggunaan

1. Buka `http://localhost:3000` di browser
2. Gunakan navbar untuk navigasi antar fitur:
   - Ajukan Event: Form pengajuan event baru
   - Persetujuan Event: Kelola persetujuan event
   - Status Event: Cek status event
   - Status Booking: Pantau status booking ruangan
   - Notifikasi Logistik: Kirim notifikasi untuk event yang disetujui

## API Documentation

### GraphQL Endpoint
- URL: `http://localhost:5000/graphql`
- Method: POST
- Content-Type: application/json

### Queries Utama
```graphql
# Query Event
query {
  events {
    id
    title
    status
    startDate
    endDate
  }
}

# Query Booking
query {
  bookings {
    id
    roomName
    status
    eventDate
  }
}
```

### Mutations Utama
```graphql
# Submit Event
mutation {
  submitEvent(input: {
    title: "Nama Event"
    description: "Deskripsi Event"
    startDate: "2024-03-20"
    endDate: "2024-03-21"
  }) {
    id
    status
  }
}

# Approve Event
mutation {
  approveEvent(id: "event_id") {
    id
    status
  }
}
```

## Pengembangan

### Backend Development
1. Aktifkan virtual environment
2. Jalankan server dengan mode debug:
```bash
flask run --debug
```

### Frontend Development
1. Di direktori frontend:
```bash
npm start
```
2. Untuk build production:
```bash
npm run build
```

## Troubleshooting

### Backend Issues
- Pastikan virtual environment aktif
- Periksa koneksi database
- Cek log Flask untuk error detail

### Frontend Issues
- Hapus `node_modules` dan `package-lock.json`
- Jalankan `npm install` ulang
- Periksa console browser untuk error

## Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request
