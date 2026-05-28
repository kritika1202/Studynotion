const router = require("express").Router();
const { getCourseProgress, markLectureComplete, getDashboardStats } = require("../controllers/progressController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/dashboard/stats", getDashboardStats);
router.get("/:courseId", getCourseProgress);
router.put("/:courseId/lectures/:lectureId", markLectureComplete);

module.exports = router;
