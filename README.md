# StudyNotion — EdTech Platform

A full-stack EdTech platform built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js), Redux Toolkit, and Tailwind CSS.

## Features

- **Course Catalog** — Browse and filter courses by category, level, and price
- **Course Enrollment** — One-click enrollment with real-time API feedback
- **Student Dashboard** — Personalized progress tracking across all enrolled courses
- **Authentication** — JWT-based login and registration with protected routes
- **Responsive UI** — Mobile-first design with Tailwind CSS

## Tech Stack

| Layer     | Technologies                                  |
|-----------|-----------------------------------------------|
| Frontend  | React 18, React Router v6, Redux Toolkit, Tailwind CSS |
| Backend   | Node.js, Express.js, JWT Auth                 |
| Database  | MongoDB, Mongoose ODM                         |
| Dev Tools | Concurrently, Nodemon, ESLint                 |

## REST API Endpoints (11 total)

| Method | Endpoint                                      | Description                     |
|--------|-----------------------------------------------|---------------------------------|
| POST   | `/api/auth/register`                          | Register a new user             |
| POST   | `/api/auth/login`                             | Login and receive JWT           |
| GET    | `/api/auth/me`                                | Get authenticated user profile  |
| GET    | `/api/courses`                                | List courses (filter/paginate)  |
| GET    | `/api/courses/featured`                       | Get featured courses            |
| GET    | `/api/courses/:id`                            | Get course details + sections   |
| POST   | `/api/enrollments`                            | Enroll in a course              |
| GET    | `/api/enrollments/my`                         | Get user's enrolled courses     |
| GET    | `/api/progress/:courseId`                     | Get lecture-level progress      |
| PUT    | `/api/progress/:courseId/lectures/:lectureId` | Mark a lecture as complete      |
| GET    | `/api/dashboard/stats`                        | Aggregated dashboard statistics |

## Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or Atlas)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/akash-sharma4/studynotion.git
cd studynotion

# 2. Install all dependencies (root + server + client)
npm run install:all

# 3. Configure environment variables
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and JWT secret

# 4. Seed sample course data
npm run seed

# 5. Start both servers concurrently
npm run dev
```

The React app runs on `http://localhost:3000` and the API on `http://localhost:5000`.

## Project Structure

```
studynotion/
├── server/                  # Express.js backend
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth + error middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routers
│   └── utils/seedData.js    # Sample data seeder
└── client/                  # React frontend
    └── src/
        ├── components/      # Reusable UI components
        ├── pages/           # Route-level components (lazy loaded)
        ├── redux/           # Store + feature slices
        └── services/        # Axios API layer
```

## Key Implementation Highlights

- **Code splitting** via `React.lazy` and `Suspense` at the route level, reducing initial bundle size
- **Redux Toolkit** async thunks for all API calls, eliminating prop-drilling across nested components
- **Protected routes** using a HOC that reads auth state from Redux
- **Optimistic UI** on enrollment — list updates immediately without waiting for the server round-trip
- **Pagination + filtering** on the course catalog backed by MongoDB query params
