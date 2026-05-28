const router = require("express").Router();
const { enroll, getMyEnrollments } = require("../controllers/enrollmentController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/", enroll);
router.get("/my", getMyEnrollments);

module.exports = router;
