const createError = (status, message) => Object.assign(new Error(message), { status });

// Validates that all required fields are present and non-empty in req.body.
// Passes a structured 400 to the error handler if any are missing.
const requireFields = (...fields) => (req, _res, next) => {
  const missing = fields.filter((f) => !req.body[f]?.toString().trim());
  if (missing.length) return next(createError(400, `Missing required fields: ${missing.join(", ")}`));
  next();
};

// Ensures req.params.id looks like a valid Mongo ObjectId before hitting the DB.
const validateObjectId = (param = "id") => (req, _res, next) => {
  if (!/^[a-f\d]{24}$/i.test(req.params[param]))
    return next(createError(400, `Invalid id format for param '${param}'`));
  next();
};

module.exports = { requireFields, validateObjectId };
