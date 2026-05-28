import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedCourses } from "../redux/slices/courseSlice";
import CourseCard from "../components/course/CourseCard";
import Spinner from "../components/common/Spinner";

const STATS = [
  { value: "10K+", label: "Active Students" },
  { value: "500+", label: "Courses" },
  { value: "120+", label: "Expert Instructors" },
  { value: "4.8", label: "Avg. Rating" },
];

export default function Home() {
  const dispatch = useDispatch();
  const { featured, loading } = useSelector((s) => s.courses);

  useEffect(() => {
    dispatch(fetchFeaturedCourses());
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-richblack-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-richblack-800 to-richblack-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              New courses added every week
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-richblack-5 leading-tight mb-6">
              Learn Without <span className="text-primary-400">Limits.</span>
            </h1>
            <p className="text-richblack-200 text-lg md:text-xl mb-10 max-w-2xl">
              Access expert-led courses in web development, data science, design, and more.
              Build real-world skills and track your progress every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses" className="btn-primary text-center text-base px-8 py-3">
                Explore Courses
              </Link>
              <Link to="/register" className="btn-secondary text-center text-base px-8 py-3">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-richblack-800 border-y border-richblack-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-primary-400 mb-1">{s.value}</p>
                <p className="text-richblack-300 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-richblack-5">Featured Courses</h2>
            <p className="text-richblack-300 mt-1">Hand-picked courses to jumpstart your journey</p>
          </div>
          <Link to="/courses" className="text-primary-400 hover:text-primary-500 text-sm font-medium transition-colors hidden sm:block">
            View all →
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
        <div className="mt-8 text-center sm:hidden">
          <Link to="/courses" className="btn-secondary">View all courses</Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-500/10 border-y border-primary-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-richblack-5 mb-4">
            Ready to start learning?
          </h2>
          <p className="text-richblack-300 mb-8 max-w-xl mx-auto">
            Join thousands of students who have already transformed their careers.
          </p>
          <Link to="/register" className="btn-primary px-10 py-3 text-base">
            Join for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
