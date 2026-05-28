module.exports = {
  JWT_EXPIRY: "7d",
  BCRYPT_ROUNDS: 10,
  PAGINATION_LIMIT: 12,
  MAX_PAGINATION_LIMIT: 50,

  COURSE_CATEGORIES: ["Web Development", "Data Science", "Mobile Development", "DevOps", "Design", "Business"],
  COURSE_LEVELS: ["Beginner", "Intermediate", "Advanced"],
  USER_ROLES: ["student", "instructor", "admin"],

  // Rate limiting — enough for dev/demo; tighten per-route in production
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100,
  AUTH_RATE_LIMIT_MAX: 20, // stricter on auth routes
};
