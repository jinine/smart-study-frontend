import { Link, useNavigate } from "react-router-dom";
import { PersonAdd24Regular, Person24Regular, SignOut24Regular, Home24Regular, ClipboardTask24Regular } from "@fluentui/react-icons";

export default function Header() {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-900 shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo / Home Link */}
        <Link to="/" className="text-2xl font-bold text-white flex items-center hover:text-blue-400 transition">
          <Home24Regular className="mr-2" /> Smart Study Assistant
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {!isLoggedIn ? (
            <>
              <Link to="/signup" className="flex items-center text-white hover:text-blue-400 transition">
                <PersonAdd24Regular className="mr-1" /> Sign Up
              </Link>
              <Link to="/login" className="flex items-center text-white hover:text-blue-400 transition">
                <Person24Regular className="mr-1" /> Login
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="flex items-center text-white hover:text-blue-400 transition">
                <ClipboardTask24Regular className="mr-1" /> Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/");
                }}
                className="flex items-center text-white hover:text-red-400 transition"
              >
                <SignOut24Regular className="mr-1" /> Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
