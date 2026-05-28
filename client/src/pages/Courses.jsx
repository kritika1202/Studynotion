import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../redux/slices/courseSlice";
import CourseCard from "../components/course/CourseCard";
import CourseFilter from "../components/course/CourseFilter";
import Spinner from "../components/common/Spinner";

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((s) => s.courses);

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    level: searchParams.get("level") || "",
    search: searchParams.get("search") || "",
    page: Number(searchParams.get("page")) || 1,
  });
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.level) params.level = filters.level;
    if (filters.search) params.search = filters.search;
    if (filters.page > 1) params.page = filters.page;
    setSearchParams(params, { replace: true });
    dispatch(fetchCourses(params));
  }, [filters, dispatch, setSearchParams]);

  const handleFilters = (next) => setFilters(next);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-richblack-5">All Courses</h1>
        <p className="text-richblack-300 mt-1">
          {pagination ? `${pagination.total} courses available` : "Browse our full catalog"}
        </p>
      </div>

      <button
        className="md:hidden mb-4 btn-secondary text-sm flex items-center gap-2"
        onClick={() => setShowFilter((v) => !v)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
        {showFilter ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="flex gap-8">
        <aside className={`w-64 shrink-0 ${showFilter ? "block" : "hidden"} md:block`}>
          <CourseFilter filters={filters} onChange={handleFilters} />
        </aside>

        <div className="flex-1 min-w-0">
          {loading ? (
            <Spinner />
          ) : list.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-richblack-300 text-lg mb-2">No courses found</p>
              <p className="text-richblack-500 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {list.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                    disabled={filters.page === 1}
                    className="btn-secondary py-2 px-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  <span className="text-richblack-300 text-sm px-3">
                    Page {filters.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                    disabled={filters.page === pagination.pages}
                    className="btn-secondary py-2 px-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
