const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Progress = require("../models/Progress");

exports.enroll = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existing) return res.status(409).json({ success: false, message: "Already enrolled" });

    const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });

    await Promise.all([
      Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } }),
      Progress.create({ student: req.user._id, course: courseId }),
    ]);

    await enrollment.populate("course", "title thumbnail category level");
    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    next(err);
  }
};

exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id, status: "active" })
      .populate("course", "title thumbnail category level rating instructor totalStudents")
      .sort({ enrolledAt: -1 });
    res.json({ success: true, data: enrollments });
  } catch (err) {
    next(err);
  }
};
