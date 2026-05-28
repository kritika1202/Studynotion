const router = require("express").Router();
const { enroll, getMyEnrollments } = require("../controllers/enrollmentController");
const { protect } = require("../middleware/auth");
const { requireFields } = require("../middleware/validate");

router.use(protect);
router.post("/", requireFields("courseId"), enroll);
router.get("/my", getMyEnrollments);

module.exports = router;
