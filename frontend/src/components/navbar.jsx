import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaStore, FaSignOutAlt } from "react-icons/fa";
import useAuthStore from "../store/authStore";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <FaStore className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold">RateIt</span>
          </Link>

          <div className="flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/signup"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to={`/user/${user?._id}`}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
                >
                  <div className="relative">
                    <FaUserCircle className="text-2xl text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rInounded-full border-2 border-white"></div>
                  </div>
                  <span className="font-medium hidden sm:block">
                    {user?.name.split(" ")[0] || "Profile"}
                  </span>
                </Link>

                {isAuthenticated && user?.role === "ADMIN" && (
                  <Link
                    to="/adminDashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-200 group"
                  title="Log Out"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="font-medium hidden sm:block">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sm:hidden absolute right-4 top-4">
        <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
