import { Link } from "react-router-dom";

const CATEGORY_COLORS = {
  "Web Development": "bg-blue-500/20 text-blue-300",
  "Data Science": "bg-purple-500/20 text-purple-300",
  "Mobile Development": "bg-green-500/20 text-green-300",
  DevOps: "bg-orange-500/20 text-orange-300",
  Design: "bg-pink-500/20 text-pink-300",
  Business: "bg-yellow-500/20 text-yellow-300",
};

const LEVEL_COLORS = {
  Beginner: "text-green-400",
  Intermediate: "text-yellow-400",
  Advanced: "text-red-400",
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-primary-400" : "text-richblack-500"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-richblack-300 ml-1">{rating?.toFixed(1)}</span>
    </div>
  );
}

export default function CourseCard({ course }) {
  const thumbSeed = course._id?.slice(-6) || "000000";
  const thumb =
    course.thumbnail ||
    `https://picsum.photos/seed/${thumbSeed}/640/360`;

  return (
    <Link to={`/courses/${course._id}`} className="card hover:border-richblack-600 transition-all duration-200 group block">
      <div className="relative overflow-hidden h-44">
        <img
          src={thumb}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {course.price === 0 && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
            Free
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[course.category] || "bg-richblack-700 text-richblack-200"}`}>
            {course.category}
          </span>
          <span className={`text-xs font-medium ${LEVEL_COLORS[course.level] || "text-richblack-300"}`}>
            {course.level}
          </span>
        </div>
        <h3 className="text-richblack-5 font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-richblack-400 text-xs mb-3 truncate">
          {course.instructor?.name}
        </p>
        <div className="flex items-center justify-between">
          <StarRating rating={course.rating} />
          <span className="text-richblack-300 text-xs">{course.totalStudents?.toLocaleString()} students</span>
        </div>
        <div className="mt-3 pt-3 border-t border-richblack-700 flex items-center justify-between">
          <span className="text-richblack-100 font-semibold text-sm">
            {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString()}`}
          </span>
          <span className="text-primary-400 text-xs font-medium group-hover:underline">View Course →</span>
        </div>
      </div>
    </Link>
  );
}
