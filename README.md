# 🎓 Student Attendance Management System

A full-stack web application for managing student attendance. Built with **React + Vite** frontend and **Node.js + Express + MongoDB** backend.

## ✨ Features

### 🔐 Authentication
- Role-based login (Admin / Teacher / Student)
- JWT authentication with secure token management
- Dark/Light mode toggle

### 👨‍💼 Admin Panel
- **Dashboard**: KPI cards, attendance trends, department analytics
- **User Management**: Students, Teachers, Departments — tabbed interface with search/filter
- **Attendance Reports**: Advanced filtering, pie charts, trend lines, Excel/PDF export
- **Timetable Management**: Visual weekly grid view

### 👩‍🏫 Teacher Panel
- **Dashboard**: Today's schedule timeline with completion status
- **Take Attendance**: Interactive digital register with per-student status toggles (Present/Absent/Late)
- **Reports**: View historical attendance data

### 🎓 Student Panel
- **Dashboard**: Circular progress indicator, subject-wise breakdown, "Classes Needed to Reach 75%" calculator
- **Calendar**: Color-coded monthly attendance view
- **Timetable**: Visual weekly schedule

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally on port 27017

### Installation

```bash
cd attendance-system
npm install
```

### Seed the Database (requires MongoDB running)

```bash
npm run seed
```

This creates demo accounts:
| Role    | Email                       | Password    |
|---------|-----------------------------|-------------|
| Admin   | admin@sams.edu              | admin123    |
| Teacher | anita@sams.edu              | teacher123  |
| Student | rahul.sharma@sams.edu       | student123  |

### Run the App

**Frontend only** (mock data, no MongoDB needed):
```bash
npm run dev
```
Open http://localhost:5173 — click Sign In with any credentials.

**Full-stack** (requires MongoDB):
```bash
npm run server   # Express API on port 5000
npm run dev      # Vite dev server on port 5173
```

## 🏗️ Project Structure

```
attendance-system/
├── src/                      # React frontend
│   ├── components/Layout/    # Sidebar, Header
│   ├── context/              # AuthContext, ThemeContext
│   ├── data/                 # Mock data
│   ├── pages/
│   │   ├── admin/            # Admin dashboard, reports, user management
│   │   ├── teacher/          # Teacher dashboard, take attendance
│   │   ├── student/          # Student dashboard, calendar
│   │   └── shared/           # Timetable, notifications
│   ├── App.jsx               # Router & layout
│   └── index.css             # Design system
├── server/                   # Express backend
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js    # JWT & RBAC middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── seed.js               # Database seeder
│   └── index.js              # Server entry point
└── .env                      # Environment variables
```

## 🎨 Design System

- **Theme**: "The Scholastic Monolith" — clean institutional aesthetic
- **Primary**: Blue (#0056b3)
- **Success**: Green (#28a745) — ≥75% attendance
- **Warning**: Amber (#ffc107) — 65-74%
- **Danger**: Red (#dc3545) — <65%
- **Typography**: Inter font family
- **Dark Mode**: Full dark mode support

## 📡 API Endpoints

| Method | Endpoint                    | Auth     | Description                    |
|--------|-----------------------------|----------|--------------------------------|
| POST   | /api/auth/login             | Public   | Login                          |
| POST   | /api/auth/register          | Public   | Register                       |
| GET    | /api/auth/me                | JWT      | Get current user               |
| GET    | /api/attendance             | JWT      | Get attendance records         |
| POST   | /api/attendance             | Teacher+ | Submit attendance              |
| GET    | /api/attendance/stats/:id   | JWT      | Student attendance stats       |
| GET    | /api/attendance/report      | Admin+   | Generate attendance report     |
| GET    | /api/users                  | Admin    | List users                     |
| GET    | /api/departments            | JWT      | List departments               |
| GET    | /api/subjects               | JWT      | List subjects                  |
| GET    | /api/dashboard/admin        | Admin    | Admin dashboard stats          |

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router, Recharts
- **Backend**: Node.js, Express 5, Mongoose
- **Database**: MongoDB
- **Auth**: JWT + bcrypt
- **Design**: Custom CSS with CSS Variables, Dark Mode

---

Built with ❤️ 
