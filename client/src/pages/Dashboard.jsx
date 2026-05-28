import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../redux/slices/progressSlice";
import EnrolledCourseCard from "../components/dashboard/EnrolledCourseCard";
import ProgressBar from "../components/dashboard/ProgressBar";
import Spinner from "../components/common/Spinner";
import { Link } from "react-router-dom";

function StatCard({ label, value, icon, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-richblack-5">{value}</p>
        <p className="text-richblack-400 text-sm">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((s) => s.progress);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading || !dashboard) return <Spinner fullPage />;

  const { totalEnrolled, completed, inProgress, courses } = dashboard;
  const overallPct =
    totalEnrolled === 0
      ? 0
      : Math.round(courses.reduce((sum, c) => sum + (c.progress || 0), 0) / totalEnrolled);

  const inProgressCourses = courses.filter((c) => c.progress > 0 && c.progress < 100);
  const notStarted = courses.filter((c) => c.progress === 0);
  const completedCourses = courses.filter((c) => c.progress === 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-richblack-5">
          Welcome back, <span className="text-primary-400">{user?.name?.split(" ")[0]}</span>
        </h1>
        <p className="text-richblack-300 mt-1">Track your learning progress and continue where you left off.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <StatCard
          label="Enrolled Courses"
          value={totalEnrolled}
          color="bg-blue-500/20"
          icon={
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatCard
          label="Completed"
          value={completed}
          color="bg-green-500/20"
          icon={
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          color="bg-primary-500/20"
          icon={
            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
      </div>

      {/* Overall progress */}
      {totalEnrolled > 0 && (
        <div className="card p-6 mb-10">
          <h2 className="text-richblack-5 font-semibold mb-3">Overall Learning Progress</h2>
          <ProgressBar percentage={overallPct} size="lg" />
          <p className="text-richblack-400 text-sm mt-2">
            You've completed {overallPct}% of your enrolled curriculum.
          </p>
        </div>
      )}

      {/* Course lists */}
      {totalEnrolled === 0 ? (
        <div className="text-center py-20">
          <p className="text-richblack-300 text-lg mb-2">No courses yet</p>
          <p className="text-richblack-500 text-sm mb-6">Enroll in a course to start tracking your progress.</p>
          <Link to="/courses" className="btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="space-y-10">
          {inProgressCourses.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-richblack-5 mb-4">Continue Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressCourses.map((enr) => (
                  <EnrolledCourseCard key={enr._id} enrollment={enr} />
                ))}
              </div>
            </section>
          )}

          {notStarted.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-richblack-5 mb-4">Not Started Yet</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notStarted.map((enr) => (
                  <EnrolledCourseCard key={enr._id} enrollment={enr} />
                ))}
              </div>
            </section>
          )}

          {completedCourses.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-richblack-5 mb-4">Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedCourses.map((enr) => (
                  <EnrolledCourseCard key={enr._id} enrollment={enr} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
