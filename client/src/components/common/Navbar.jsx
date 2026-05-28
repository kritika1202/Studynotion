import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navLink = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? "text-primary-400" : "text-richblack-100 hover:text-richblack-5"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-richblack-800 border-b border-richblack-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary-400 tracking-tight">
            Study<span className="text-richblack-5">Notion</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLink} end>Home</NavLink>
            <NavLink to="/courses" className={navLink}>Courses</NavLink>
            {user && <NavLink to="/dashboard" className={navLink}>Dashboard</NavLink>}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-richblack-200">Hi, {user.name.split(" ")[0]}</span>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Log In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-richblack-100 p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-richblack-800 border-t border-richblack-700 px-4 py-4 space-y-3">
          <NavLink to="/" className={navLink} end onClick={() => setMobileOpen(false)}>Home</NavLink>
          <br />
          <NavLink to="/courses" className={navLink} onClick={() => setMobileOpen(false)}>Courses</NavLink>
          {user && (
            <>
              <br />
              <NavLink to="/dashboard" className={navLink} onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
            </>
          )}
          <div className="pt-3 border-t border-richblack-700 flex flex-col gap-2">
            {user ? (
              <button onClick={handleLogout} className="btn-secondary text-sm w-full">Logout</button>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm text-center" onClick={() => setMobileOpen(false)}>Log In</Link>
                <Link to="/register" className="btn-primary text-sm text-center" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
