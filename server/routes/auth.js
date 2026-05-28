const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { requireFields } = require("../middleware/validate");
const { AUTH_RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } = require("../config/constants");

// Stricter rate limit on auth endpoints to slow brute-force attempts
const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: AUTH_RATE_LIMIT_MAX,
  message: { success: false, message: "Too many auth attempts, please try again in 15 minutes" },
});

router.post("/register", authLimiter, requireFields("name", "email", "password"), register);
router.post("/login", authLimiter, requireFields("email", "password"), login);
router.get("/me", protect, getMe);

module.exports = router;
