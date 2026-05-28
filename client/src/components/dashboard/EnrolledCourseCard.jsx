import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";

export default function EnrolledCourseCard({ enrollment }) {
  const { course, progress = 0, completedLectures = 0, totalLectures = 0 } = enrollment;
  const thumb =
    course?.thumbnail ||
    `https://picsum.photos/seed/${course?._id?.slice(-6) || "aaa"}/640/360`;

  return (
    <div className="card flex flex-col sm:flex-row gap-0 sm:gap-4 overflow-hidden">
      <div className="relative w-full sm:w-36 h-28 sm:h-auto shrink-0 overflow-hidden">
        <img
          src={thumb}
          alt={course?.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {progress === 100 && (
          <div className="absolute inset-0 bg-green-900/60 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between p-4 flex-1 min-w-0">
        <div>
          <span className="text-xs text-richblack-400 uppercase tracking-wide">{course?.category}</span>
          <h3 className="text-richblack-5 font-semibold text-sm mt-1 line-clamp-2 mb-2">{course?.title}</h3>
        </div>
        <div>
          <ProgressBar percentage={progress} />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-richblack-400">
              {completedLectures}/{totalLectures} lectures
            </span>
            <Link
              to={`/courses/${course?._id}`}
              className="text-xs text-primary-400 hover:text-primary-500 font-medium transition-colors"
            >
              {progress === 0 ? "Start →" : progress === 100 ? "Review →" : "Continue →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
