require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } = require("./config/constants");

// Fail fast if required env vars are missing
const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];
REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const app = express();

// Render (and most cloud platforms) sit behind a reverse proxy
app.set("trust proxy", 1);

connectDB();

// Security headers
app.use(helmet());

// CORS — restrict to the client origin in production
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));

// Global rate limit — protects all routes; auth routes add a stricter limit on top
app.use(
  rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later" },
  })
);

app.use(express.json({ limit: "10kb" })); // guard against large payload attacks

app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/enrollments", require("./routes/enrollments"));
app.use("/api/progress", require("./routes/progress"));

// Health check — useful for deployment probes
app.get("/api/health", (_req, res) => res.json({ success: true, message: "OK" }));

// Catch-all for undefined routes
app.all("*", (_req, res) => res.status(404).json({ success: false, message: "Route not found" }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`)
);
