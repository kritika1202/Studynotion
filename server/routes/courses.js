const router = require("express").Router();
const { getCourses, getFeaturedCourses, getCourseById } = require("../controllers/courseController");
const { validateObjectId } = require("../middleware/validate");

router.get("/", getCourses);
router.get("/featured", getFeaturedCourses);
router.get("/:id", validateObjectId("id"), getCourseById);

module.exports = router;
