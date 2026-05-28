export default function ProgressBar({ percentage, showLabel = true, size = "md" }) {
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };
  const color =
    percentage === 100 ? "bg-green-500" : percentage >= 60 ? "bg-primary-400" : percentage >= 30 ? "bg-blue-400" : "bg-richblack-500";

  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-richblack-400">Progress</span>
          <span className={`text-xs font-semibold ${percentage === 100 ? "text-green-400" : "text-primary-400"}`}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={`w-full bg-richblack-700 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
