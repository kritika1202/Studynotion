const Progress = require("../models/Progress");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const [progress, course] = await Promise.all([
      Progress.findOne({ student: req.user._id, course: courseId }),
      Course.findById(courseId).select("sections"),
    ]);
    if (!progress) return res.status(404).json({ success: false, message: "Progress record not found" });

    const totalLectures = course.totalLectures;
    res.json({
      success: true,
      data: {
        completedLectures: progress.completedLectures,
        percentage: progress.getPercentage(totalLectures),
        totalLectures,
        lastAccessedAt: progress.lastAccessedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.markLectureComplete = async (req, res, next) => {
  try {
    const { courseId, lectureId } = req.params;

    const already = await Progress.findOne({
      student: req.user._id,
      course: courseId,
      "completedLectures.lectureId": lectureId,
    });
    if (already) return res.json({ success: true, message: "Already marked complete" });

    const [progress, course] = await Promise.all([
      Progress.findOneAndUpdate(
        { student: req.user._id, course: courseId },
        { $push: { completedLectures: { lectureId } }, lastAccessedAt: new Date() },
        { new: true }
      ),
      Course.findById(courseId).select("sections"),
    ]);

    const totalLectures = course.totalLectures;
    const percentage = progress.getPercentage(totalLectures);

    if (percentage === 100) {
      await Enrollment.findOneAndUpdate(
        { student: req.user._id, course: courseId },
        { status: "completed", completedAt: new Date() }
      );
    }

    res.json({ success: true, data: { percentage, completedCount: progress.completedLectures.length } });
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate("course", "title thumbnail category totalStudents")
      .lean();

    const progressDocs = await Progress.find({ student: req.user._id });

    const courses = await Promise.all(
      enrollments.map(async (enr) => {
        const courseDoc = await Course.findById(enr.course._id).select("sections");
        const prog = progressDocs.find((p) => p.course.toString() === enr.course._id.toString());
        const totalLectures = courseDoc ? courseDoc.totalLectures : 0;
        const completed = prog ? prog.completedLectures.length : 0;
        return {
          ...enr,
          progress: totalLectures ? Math.round((completed / totalLectures) * 100) : 0,
          completedLectures: completed,
          totalLectures,
        };
      })
    );

    res.json({
      success: true,
      data: {
        totalEnrolled: enrollments.length,
        completed: enrollments.filter((e) => e.status === "completed").length,
        inProgress: enrollments.filter((e) => e.status === "active").length,
        courses,
      },
    });
  } catch (err) {
    next(err);
  }
};
