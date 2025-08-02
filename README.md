# SCHOOLABUS
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black?logo=next.js)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.x-blue?logo=flask)](https://flask.palletsprojects.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.0.0-orange?logo=firebase)](https://firebase.google.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)](https://postgresql.org/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Ready-blue?logo=google-cloud)](https://cloud.google.com/)

## 🚀 Overview
*Skoola Bus* is a smart and intuitive school transport management web app that allows parents, students, and admins to easily *book, **track, and **pay* for school transport services. Built for efficiency, safety, and convenience, it’s the go-to solution for modern school commuting.

### Architecture
#### Frontend
- [Next.js 15 (App Router)](https://nextjs.org/)
- React + Tailwind CSS
- React Icons (for UI components)
- Dynamic components (e.g., Payment modals, Dashboard views)
- Google Maps
- Leaflet
- Socket

#### Backend
- [Flask](https://flask.palletsprojects.com/) API
- SQLAlchemy + SQLite (or PostgreSQL)
- Flask-JWT-Extended for authentication
- Flask Socket

---

## 🚀 Features

- Secure user authentication (JWT-based)
- View and book available school bus trips
- Integrated M-Pesa payments (with confirmation)
- Admin bus & trip management (create, update, delete)
- Route tracking & trip history
- Role-based access (Parent / Driver / Admin)
- Mobile-friendly, responsive UI

The platform enables:

- **Parents** to book a bus track the bus, make payments.
- **Drivers** to start rides and manage rides.
- **Administrators** to manage the ecosystem and maintain operation standards.

### 🔧 Technical Features
- **Server-Side Rendering (SSR)** with Next.js App Router
- **RESTful API** with Flask-RESTful
- **Cloud SQL** with PostgreSQL
- **Real-time data** with optimized caching
- **Responsive design** with Tailwind CSS
- **Smooth animations** with Framer Motion
- **Database migrations** with Alembic

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 15    │◄──►│   Flask API     │◄──►│   Firebase      │
│   Frontend      │    │   Backend       │    │      FCM        │
│   (Port 3000)   │    │   (Port 5000)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Tailwind CSS    │    │  PostgreSQL     │    │   Cloudinary    │
│ Framer Motion   │    │  _          _   │    │ Media Storage   │
│ React Context   │    │  SQL            │    │ + File Upload   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    
│ Custom Hooks    │    
│ Component Lib   │    
└─────────────────│

## 📸 UI Snapshots

- *Login Page* with glassmorphism and school bus background
- *Payment Page* with bus-themed hero layout and modal confirmations
- *Booking Dashboard* – View trips, book rides, manage status
- *Admin Panel* – Manage users, buses, trips

---

## 📦 Getting Started (Development)

#### Prerequisites
- Install Node.js (18+) and Python (3.11+).
- Set up Firebase and Google accounts.

---

### 1. Clone the Repository

```bash
git clone https://github.com/phil-ogutu/School-Minibus-Booking-System.git
cd skoola-bus
```

### 2. Backend Setup
```bash
   cd backend
   pipenv shell
   pipenv install
   flask db init
   flask db migrate -m"inital migration"
   flask db upgrade head
   flask run
```
copy contents of env example into a new .env file
### 3. Frontend Setup
```bash
   cd frontend
   npm install
   npm run dev
```
copy contents of env example into a new .env file


### 4. Access the Application
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`

### Frontend Structure
```
frontend/
├── src/app/                    # Next.js App Router
│   ├── layout.js              # Root layout
│   ├── driver/                # Driver dashboard
│   ├── track/                 # Tracking feature
│   ├── bookings/              # Booking features
│   ├── parents/               # Parents features
│   └── admin/                 # Admin pages
├── components/                
│   ├── ui/                    # UI components
│   ├── reusables/             # Reusables components
│   └── .../                   # other components
├── hooks/                     # Custom React hooks
├── contexts/                  # React Context providers
└── lib/                       # Utilities & config
```

### Backend Structure
```
server/
├── app.py                     # Flask application
├── config.py                  # Configuration
├── service.py                 # Services Functions
├── models/                    # Database models
├── controllers/               # API endpoints
│   ├── auth/                  # Authentication
│   ├── bookings.py            # Booking management
│   ├── routes.py              # Routes
│   └── users .py              # Users
├── utilities/                 # Utilities
├── migrations/                # Database migrations
└── middleware/                # Middleware


## 🎯 User Roles

### 👨‍🎓 Parent
- Book Buses
- View Buses and Routes

### 🏢 Driver
- Start/End Trips

### 👨‍💼 Administrators
- Create Routes
- Manage user accounts and roles
- Oversee bus operations
- Monitor analytics
- Manage bookings

## 🔐 Authentication & Security

- **JWT tokens** for stateless sessions
- **Role-based access control (RBAC)**
- **Input validation** on all endpoints
- **CORS protection** for API security
- **SQL injection prevention** via ORM

## 📊 API Documentation


### Key Endpoints
- `POST /api/auth` - User authentication
- `GET /api/drivers` - List drivers
- `POST /api/routes` - List routes
- `GET /api/bookings` - List bookings
- `POST /api/buses` - Place buses

## 📝 Environment Variables

### Backend (.env)
```env
    SECRET_KEY=your_secret_key
    DATABASE_URL=
    JWT_SECRET_KEY=jwt_secret_key
    FIREBASE_SERVICE_ACCOUNT_KEY=
    MPESA_CONSUMER_KEY=
    MPESA_CONSUMER_SECRET=
    MPESA_SHORTCODE=
    MPESA_PASSKEY=
    CALLBACK_URL=
```

### Frontend (.env.local)
```env
    NEXT_PUBLIC_BASE_URL=http://localhost:5000
    NEXT_PUBLIC_FIREBASE_VAPID_KEY=
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
    EMAIL_USER=
    EMAIL_PASSWORD=
```

## 🤝 Contributing

1. clone the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🚀 Future Enhancements

- **Payment Integration:** Add M-Pesa for diverse payment options
- **Mobile App:** Native mobile applications for iOS and Android
- **Notifications:** Push notifications for trip updates and messages

## 👥 Team Members  

| Name                | Role                    | Contact / Profile                                        |  
|---------------------|-------------------------|----------------------------------------------------------|  
| **Dennis Sammy**    | Full Stack Developer    | [GitHub](https://github.com/dennissammy77)               |  
| **Phil Ogutu**      | Frontend Developer      | [Github](https://github.com/phil-ogutu)                  |  
| **Winnie Siriba**   | Frontend Developer      | [GitHub](https://github.com/Winnie-Siriba)               |  
| **Benjamin Lubanga**| Frontend Developer      | [GitHub]()                                               |  
| **Dedan Opiyo**     | Full Stack Developer    | [GitHub](https://github.com/DedanOpiyo)                  |  
| **Emmanuel Njung'e**| Full Stack Developer    | [GitHub](https://github.com/Emmanuel-Njunge)             |  

---