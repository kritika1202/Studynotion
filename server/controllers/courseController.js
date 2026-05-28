const Course = require("../models/Course");

exports.getCourses = async (req, res, next) => {
  try {
    const { category, level, search, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.title = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .select("-sections")
        .populate("instructor", "name avatar")
        .sort({ totalStudents: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Course.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: courses,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isFeatured: true })
      .select("-sections")
      .populate("instructor", "name avatar")
      .limit(6);
    res.json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name avatar");
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};
