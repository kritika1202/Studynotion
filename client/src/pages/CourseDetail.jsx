import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById, clearSelected } from "../redux/slices/courseSlice";
import { enrollInCourse } from "../redux/slices/enrollmentSlice";
import Spinner from "../components/common/Spinner";

function AccordionSection({ section, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="border border-richblack-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-richblack-700 hover:bg-richblack-600 transition-colors text-left"
      >
        <div>
          <span className="text-richblack-5 font-medium">{section.title}</span>
          <span className="text-richblack-400 text-xs ml-3">{section.lectures.length} lectures</span>
        </div>
        <svg className={`w-4 h-4 text-richblack-300 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="divide-y divide-richblack-700">
          {section.lectures.map((lec) => (
            <li key={lec._id} className="flex items-center justify-between px-5 py-3 bg-richblack-800">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-richblack-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-richblack-200 text-sm">{lec.title}</span>
                {lec.isFree && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Preview</span>
                )}
              </div>
              <span className="text-richblack-400 text-xs">{lec.duration} min</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CourseDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected: course, loading } = useSelector((s) => s.courses);
  const { list: enrollments, enrolling } = useSelector((s) => s.enrollments);
  const { user } = useSelector((s) => s.auth);

  const isEnrolled = enrollments.some((e) => e.course?._id === id);

  useEffect(() => {
    dispatch(fetchCourseById(id));
    return () => dispatch(clearSelected());
  }, [dispatch, id]);

  const handleEnroll = async () => {
    if (!user) return navigate("/login");
    await dispatch(enrollInCourse(id));
    navigate("/dashboard");
  };

  if (loading || !course) return <Spinner fullPage />;

  const thumb =
    course.thumbnail ||
    `https://picsum.photos/seed/${id?.slice(-6)}/1280/720`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full font-medium">
                {course.category}
              </span>
              <span className="text-xs bg-richblack-700 text-richblack-200 px-3 py-1 rounded-full">
                {course.level}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-richblack-5 mb-3">{course.title}</h1>
            <p className="text-richblack-300 leading-relaxed">{course.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-richblack-300">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {course.rating?.toFixed(1)}
              </span>
              <span>·</span>
              <span>{course.totalStudents?.toLocaleString()} students</span>
              <span>·</span>
              <span>By {course.instructor?.name}</span>
            </div>
          </div>

          {/* Curriculum */}
          <div>
            <h2 className="text-xl font-bold text-richblack-5 mb-4">Course Curriculum</h2>
            <div className="space-y-2">
              {course.sections?.map((section, i) => (
                <AccordionSection key={section._id} section={section} index={i} />
              ))}
            </div>
            <p className="text-richblack-400 text-sm mt-3">
              {course.totalLectures} lectures · {course.totalDuration} min total
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <img src={thumb} alt={course.title} className="w-full h-44 object-cover" />
            <div className="p-5 space-y-4">
              <p className="text-2xl font-bold text-richblack-5">
                {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString()}`}
              </p>
              {isEnrolled ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn-primary w-full text-center"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="btn-primary w-full text-center disabled:opacity-70"
                >
                  {enrolling ? "Enrolling…" : "Enroll Now"}
                </button>
              )}
              <ul className="space-y-2 text-sm text-richblack-300">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Full lifetime access
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Access on mobile and desktop
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Certificate of completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
