import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-richblack-800 border-t border-richblack-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-xl font-bold text-primary-400 mb-2">
              Study<span className="text-richblack-5">Notion</span>
            </p>
            <p className="text-richblack-300 text-sm">Learn without limits. Build the future.</p>
          </div>
          <div>
            <h4 className="text-richblack-100 font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-richblack-300">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/courses" className="hover:text-primary-400 transition-colors">All Courses</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary-400 transition-colors">My Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-richblack-100 font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-richblack-300">
              {["Web Development", "Data Science", "DevOps", "Design"].map((c) => (
                <li key={c}>
                  <Link to={`/courses?category=${encodeURIComponent(c)}`} className="hover:text-primary-400 transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-richblack-700 text-center text-richblack-400 text-sm">
          © {new Date().getFullYear()} StudyNotion. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
