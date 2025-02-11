import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400">
          Smart Study Assistant
        </Link>
        <div>
          {!isLoggedIn ? (
            <>
              <Link to="/signup" className="ml-4 text-white hover:text-blue-400">
                Sign Up
              </Link>
              <Link to="/login" className="ml-4 text-white hover:text-blue-400">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link to='/Dashboard'
                className="ml-4 text-white hover:text-blue-400 cursor-pointer">Dashboard</Link>
              <a
                className="ml-4 text-white hover:text-blue-400 cursor-pointer"
                onClick={() => {
                  localStorage.setItem("token", "");
                  navigate("/");
                }}
              >
                Sign Out
              </a></>

          )}
        </div>
      </div>
    </nav>
  );
}