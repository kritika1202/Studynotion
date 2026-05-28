const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ success: true, token: signToken(user._id), user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, token: signToken(user._id), user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toPublic() });
};
