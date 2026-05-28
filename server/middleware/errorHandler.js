// Mongoose cast error → 404 (e.g. invalid ObjectId in URL params)
const handleCastError = (err) => ({
  status: 404,
  message: `Resource not found (invalid id: ${err.value})`,
});

// Mongoose duplicate key → 409
const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return { status: 409, message: `${field} already exists` };
};

// Mongoose validation error → 400
const handleValidationError = (err) => ({
  status: 400,
  message: Object.values(err.errors)
    .map((e) => e.message)
    .join("; "),
});

// JWT errors → 401
const handleJWTError = () => ({ status: 401, message: "Invalid token, please log in again" });
const handleJWTExpired = () => ({ status: 401, message: "Session expired, please log in again" });

const errorHandler = (err, _req, res, _next) => {
  let status = err.status || err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err.name === "CastError") ({ status, message } = handleCastError(err));
  if (err.code === 11000) ({ status, message } = handleDuplicateKey(err));
  if (err.name === "ValidationError") ({ status, message } = handleValidationError(err));
  if (err.name === "JsonWebTokenError") ({ status, message } = handleJWTError());
  if (err.name === "TokenExpiredError") ({ status, message } = handleJWTExpired());

  if (process.env.NODE_ENV !== "production" && status === 500) {
    console.error("[Error]", err);
  }

  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
