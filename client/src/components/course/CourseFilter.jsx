const CATEGORIES = ["Web Development", "Data Science", "Mobile Development", "DevOps", "Design", "Business"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function CourseFilter({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value, page: 1 });
  const clear = () => onChange({ page: 1 });

  const hasFilters = filters.category || filters.level || filters.search;

  return (
    <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-richblack-5 font-semibold">Filters</h3>
        {hasFilters && (
          <button onClick={clear} className="text-xs text-primary-400 hover:text-primary-500 transition-colors">
            Clear all
          </button>
        )}
      </div>

      <div>
        <label className="block text-richblack-300 text-xs font-medium mb-2">Search</label>
        <input
          type="text"
          value={filters.search || ""}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Search courses..."
          className="input-field text-sm py-2"
        />
      </div>

      <div>
        <label className="block text-richblack-300 text-xs font-medium mb-2">Category</label>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => set("category", filters.category === cat ? "" : cat)}
                className="accent-primary-400"
              />
              <span className={`text-sm transition-colors ${filters.category === cat ? "text-primary-400" : "text-richblack-200 group-hover:text-richblack-5"}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-richblack-300 text-xs font-medium mb-2">Level</label>
        <div className="space-y-1.5">
          {LEVELS.map((lvl) => (
            <label key={lvl} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="level"
                checked={filters.level === lvl}
                onChange={() => set("level", filters.level === lvl ? "" : lvl)}
                className="accent-primary-400"
              />
              <span className={`text-sm transition-colors ${filters.level === lvl ? "text-primary-400" : "text-richblack-200 group-hover:text-richblack-5"}`}>
                {lvl}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
