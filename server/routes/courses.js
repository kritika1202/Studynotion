const router = require("express").Router();
const { getCourses, getFeaturedCourses, getCourseById } = require("../controllers/courseController");

router.get("/", getCourses);
router.get("/featured", getFeaturedCourses);
router.get("/:id", getCourseById);

module.exports = router;
