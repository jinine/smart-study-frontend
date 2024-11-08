import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Smart Study Assistant</Link>
        <nav>
          <Link to="/signup" className="ml-4 hover:text-blue-400">
            Sign Up
          </Link>
          <Link to="/login" className="ml-4 hover:text-blue-400">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
