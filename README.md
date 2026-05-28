# StudyNotion

An EdTech platform where students can browse courses, enroll, and track their progress. Built this end-to-end to get comfortable connecting a React + Redux frontend to a real REST API with auth, MongoDB, and proper error handling.

**Stack:** React 18 · Redux Toolkit · Node.js · Express · MongoDB · Tailwind CSS

---

## What it does

- Course catalog with category/level filters and search — results are URL-synced so you can share a filtered link
- Course detail page with a collapsible curriculum and an enrollment sidebar
- Student dashboard showing progress bars per course, grouped by in-progress / not started / completed
- JWT auth — register, log in, protected routes
- 11 REST endpoints (auth, courses, enrollments, progress tracking)

---

## Running locally

You'll need Node.js ≥ 18 and MongoDB (local or Atlas).

```bash
# Install everything
npm run install:all

# Set up environment
cp server/.env.example server/.env
# Fill in MONGO_URI and JWT_SECRET in server/.env

# Seed some sample courses
npm run seed

# Start both servers
npm run dev
```

React runs on `localhost:3000`, the API on `localhost:5000`.

To generate a JWT secret quickly:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Other scripts: `npm run server` (API only), `npm run client` (React only).

---

## API

All endpoints live under `/api`. Protected routes need `Authorization: Bearer <token>`.

```
POST   /auth/register              { name, email, password }
POST   /auth/login                 { email, password }
GET    /auth/me                    🔒

GET    /courses                    ?category, level, search, page, limit
GET    /courses/featured
GET    /courses/:id

POST   /enrollments                🔒  { courseId }
GET    /enrollments/my             🔒

GET    /progress/dashboard/stats   🔒
GET    /progress/:courseId         🔒
PUT    /progress/:courseId/lectures/:lectureId  🔒
```

The `api.http` file in the root has all of these pre-filled — open it in VS Code with the REST Client extension and you can run every request without Postman.

---

## Project structure

```
studynotion/
├── server/
│   ├── config/          db connection, constants (JWT expiry, rate limits)
│   ├── controllers/     thin route handlers — auth, courses, enrollment, progress
│   ├── middleware/       JWT auth, error handler, field validation
│   ├── models/          User, Course (nested sections/lectures), Enrollment, Progress
│   ├── routes/
│   └── utils/seedData.js
└── client/src/
    ├── components/      Navbar, CourseCard, CourseFilter, ProgressBar, etc.
    ├── pages/           Home, Courses, CourseDetail, Dashboard, Login, Register
    ├── redux/           store + 4 slices (auth, courses, enrollments, progress)
    └── services/api.js  Axios instance with JWT interceptor
```

---

## A few things worth knowing if you dig into the code

**Redux over Context** — I started with Context but switched after noticing it was re-rendering the Navbar on every progress update. RTK slices isolate state domains, and `createAsyncThunk` handles the loading/error lifecycle without extra code.

**Lazy loading** — each page is a separate `React.lazy` import in `App.jsx`. The Dashboard and CourseDetail pages are never downloaded until the user navigates there.

**Enrollment duplicates** — rather than querying first, the Enrollment model has a compound unique index on `{ student, course }`. A second enroll attempt hits a Mongo `11000` error which the error handler converts to a 409.

**Progress percentage** — `Course` has a `totalLectures` virtual that sums across sections. `Progress.getPercentage()` divides completed count by that. When it hits 100, the enrollment is automatically marked complete.

**Rate limiting** — auth routes are capped at 20 requests per 15 minutes (vs 100 globally) to slow brute-force without needing anything heavier.
