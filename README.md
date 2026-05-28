# StudyNotion — EdTech Platform

> A full-stack EdTech platform — course catalog, enrollment, and real-time progress tracking — built with the MERN stack, Redux Toolkit, and Tailwind CSS.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](#)
[![React](https://img.shields.io/badge/React-18-blue)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)](#)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-purple)](#)

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack & Why](#tech-stack--why)
3. [Architecture](#architecture)
4. [REST API Reference](#rest-api-reference-11-endpoints)
5. [Getting Started](#getting-started)
6. [Project Structure](#project-structure)
7. [Key Implementation Decisions](#key-implementation-decisions)

---

## Features

| Feature | Details |
|---------|---------|
| **Course Catalog** | Browse 6 categories, filter by level, full-text search, paginated (12/page) |
| **Course Detail** | Accordion curriculum, lecture list with durations, sticky enrollment sidebar |
| **Enrollment** | One-click enroll, duplicate prevention, optimistic Redux update |
| **Student Dashboard** | Stat cards, overall progress bar, per-course progress grouped by status |
| **Auth** | JWT register/login, 7-day tokens, bcrypt password hashing, protected routes |
| **Security** | Helmet headers, rate limiting (global + stricter on auth), 10 kb body cap |
| **Responsive** | Mobile-first Tailwind CSS, hamburger Navbar, stacked dashboard on small screens |
| **Performance** | Route-level `React.lazy` + `Suspense`, lazy-loaded images, pagination |

---

## Tech Stack & Why

### Backend
| Technology | Why this choice |
|-----------|----------------|
| **Node.js + Express** | Non-blocking I/O is ideal for many concurrent API requests; Express keeps the middleware chain explicit and testable |
| **MongoDB + Mongoose** | Flexible schema suits course content (nested sections/lectures vary); virtual fields (`totalLectures`, `totalDuration`) keep aggregation logic at the model layer |
| **JWT (jsonwebtoken)** | Stateless auth — no session store needed; 7-day expiry balances UX and security |
| **bcryptjs** | Industry-standard adaptive hashing; cost factor 10 is the OWASP-recommended baseline |
| **helmet + express-rate-limit** | Helmet sets 11 security headers in one line; rate limiting on auth routes slows brute-force without a full WAF |

### Frontend
| Technology | Why this choice |
|-----------|----------------|
| **React 18** | Concurrent features, `React.lazy` for code splitting; ecosystem maturity |
| **Redux Toolkit** | `createAsyncThunk` manages pending/fulfilled/rejected state without boilerplate, eliminating prop-drilling across deeply nested components |
| **React Router v6** | Nested layouts, `useSearchParams` for URL-synced filters, `Navigate` for protected routes |
| **Tailwind CSS** | Utility-first avoids CSS file bloat; custom `richblack` palette matches the design system; JIT purges unused classes in production |
| **Axios** | Request interceptor auto-attaches the JWT from the Redux store — no manual header on every call |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│  React 18  ──►  Redux Store  ──►  Axios  ──►  REST API     │
│  (pages/     (auth/courses/      (JWT          (Express     │
│   comps)      enrollments/       interceptor)   + MongoDB)  │
│              progress slices)                               │
└─────────────────────────────────────────────────────────────┘

Request flow (e.g. course enrollment):
  1. User clicks "Enroll Now"  →  CourseDetail.jsx
  2. Dispatches enrollInCourse(courseId)  →  enrollmentSlice.js
  3. createAsyncThunk calls POST /api/enrollments  →  Axios
  4. Axios interceptor reads token from store, sets Authorization header
  5. Express protect middleware validates JWT  →  enrollmentController.js
  6. Controller checks for duplicate, creates Enrollment + Progress docs
  7. Returns enrollment with populated course data
  8. Slice updates list (optimistic) → UI re-renders without page reload

Data model relationships:
  User (1) ──── (N) Enrollment ──── (1) Course
  User (1) ──── (N) Progress  ──── (1) Course
  Course has nested Sections[] → Lectures[]
```

---

## REST API Reference (11 endpoints)

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

All responses follow: `{ success: boolean, data?: any, message?: string }`

### Auth
| Method | Endpoint | Auth | Body / Params |
|--------|----------|------|---------------|
| `POST` | `/auth/register` | — | `name, email, password` |
| `POST` | `/auth/login` | — | `email, password` |
| `GET` | `/auth/me` | ✓ | — |

### Courses
| Method | Endpoint | Auth | Query Params |
|--------|----------|------|--------------|
| `GET` | `/courses` | — | `category, level, search, page, limit` |
| `GET` | `/courses/featured` | — | — |
| `GET` | `/courses/:id` | — | — |

### Enrollments
| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| `POST` | `/enrollments` | ✓ | `courseId` |
| `GET` | `/enrollments/my` | ✓ | — |

### Progress
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| `GET` | `/progress/dashboard/stats` | ✓ | Aggregated stats for all enrolled courses |
| `GET` | `/progress/:courseId` | ✓ | Per-lecture completion list + percentage |
| `PUT` | `/progress/:courseId/lectures/:lectureId` | ✓ | Auto-completes enrollment at 100% |

> **Quick demo:** Open `api.http` in VS Code with the REST Client extension — all 11 requests are pre-written.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone & install

```bash
git clone https://github.com/akash-sharma4/studynotion.git
cd studynotion
npm run install:all
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
# Edit server/.env — at minimum set MONGO_URI and JWT_SECRET
# Generate a JWT secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Seed sample data

```bash
npm run seed
# Inserts 6 courses across 5 categories with realistic content
```

### 4. Start dev servers

```bash
npm run dev
# React: http://localhost:3000
# API:   http://localhost:5000
```

### Available scripts

| Script | What it does |
|--------|-------------|
| `npm run dev` | Starts both servers concurrently |
| `npm run server` | API server only (nodemon) |
| `npm run client` | React dev server only |
| `npm run seed` | Seeds 6 sample courses into MongoDB |
| `npm run install:all` | Installs root + server + client dependencies |

---

## Project Structure

```
studynotion/
├── api.http                     ← REST client file for VS Code / JetBrains
├── server/
│   ├── config/
│   │   ├── constants.js         ← Centralized config (JWT expiry, rate limits, etc.)
│   │   └── db.js                ← Mongoose connection
│   ├── controllers/             ← Route handlers (thin, delegates to models)
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   └── progressController.js
│   ├── middleware/
│   │   ├── auth.js              ← protect (JWT verify) + requireRole
│   │   ├── errorHandler.js      ← Maps Mongoose/JWT errors to HTTP responses
│   │   └── validate.js          ← requireFields() + validateObjectId()
│   ├── models/                  ← Mongoose schemas
│   │   ├── Course.js            ← Nested sections/lectures, virtual totalLectures
│   │   ├── Enrollment.js        ← Unique (student, course) index
│   │   ├── Progress.js          ← Per-lecture completion tracking
│   │   └── User.js              ← bcrypt pre-save hook, toPublic() method
│   ├── routes/                  ← Express routers (validation middleware applied here)
│   ├── utils/seedData.js        ← Demo data seeder
│   └── server.js                ← Express app setup, startup env guard
└── client/
    └── src/
        ├── components/
        │   ├── common/          ← Navbar, Footer, Spinner, ProtectedRoute
        │   ├── course/          ← CourseCard, CourseFilter
        │   └── dashboard/       ← ProgressBar, EnrolledCourseCard
        ├── pages/               ← Route-level components (React.lazy loaded)
        │   ├── Home.jsx         ← Featured courses + CTA
        │   ├── Courses.jsx      ← Catalog with URL-synced filters + pagination
        │   ├── CourseDetail.jsx ← Accordion curriculum + enrollment sidebar
        │   ├── Dashboard.jsx    ← Student progress overview
        │   ├── Login.jsx
        │   └── Register.jsx
        ├── redux/
        │   ├── store.js
        │   └── slices/          ← authSlice, courseSlice, enrollmentSlice, progressSlice
        └── services/api.js      ← Axios instance with JWT request interceptor
```

---

## Key Implementation Decisions

**Why Redux Toolkit instead of Context API?**
Context re-renders every consumer on any state change. With 4 distinct state domains (auth, courses, enrollments, progress), RTK's slice isolation means a progress update doesn't re-render the navbar. `createAsyncThunk` also gives `pending`/`fulfilled`/`rejected` lifecycle states for free, which is exactly what loading spinners and error messages need.

**Why `React.lazy` at the route level?**
The Dashboard, CourseDetail, and auth pages each pull in heavy dependencies (charts, form libs, large component trees). Lazy loading them means a user landing on the homepage only downloads the Home bundle — not code for pages they'll never visit. Webpack splits each lazy import into its own chunk automatically.

**How does JWT auth avoid re-fetching on every request?**
`authSlice` persists the token to `localStorage` and reads it back on boot. If the token exists, the Axios interceptor attaches it to every outgoing request via `store.getState().auth.token` — no redundant `/me` calls. The `fetchCurrentUser` thunk only fires once on App mount when a token is present, to validate it and load the user object.

**How does the enrollment duplicate-prevention work?**
The `Enrollment` model has a compound unique index on `{ student, course }`. If the user tries to enroll twice, MongoDB throws a `11000` duplicate key error, which the `errorHandler` middleware catches and returns as a `409 Conflict` — no extra query needed.

**How is progress percentage calculated?**
`Progress.getPercentage(totalLectures)` divides `completedLectures.length` by `totalLectures` (a virtual field on Course that reduces across `sections[].lectures`). When percentage hits 100, the progress route automatically updates the Enrollment status to `"completed"` and sets `completedAt`.
