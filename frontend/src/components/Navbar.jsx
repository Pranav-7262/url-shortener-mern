import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });

      // Clear auth client state (cookies will be cleared by backend on logout)
      setUser(null);

      navigate("/login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <nav className="w-full bg-gray-900/70 backdrop-blur-md border-b border-gray-800 text-white py-4 px-6 flex items-center justify-between shadow-lg sticky top-0 z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold tracking-wide bg-linear-to-r from-green-400 to-green-600 text-transparent bg-clip-text"
      >
        URL Shortener
      </Link>

      <div className="flex items-center gap-6">
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className="hover:text-green-400 transition text-lg"
        >
          Dashboard
        </Link>
        <Link
          to="/profile"
          className="hover:text-green-400 transition text-lg hidden sm:inline"
        >
          Profile
        </Link>
        <Link
          to="/help"
          className="hover:text-green-400 transition text-lg hidden sm:inline"
        >
          Help
        </Link>
        <Link
          to="/about"
          className="hover:text-green-400 transition text-lg hidden sm:inline"
        >
          About
        </Link>

        {/* Show username */}
        {user && (
          <span className="text-gray-300 hidden sm:block">Hi, {user.name}</span>
        )}
        <ThemeToggle />

        {/* Mobile quick link to 'Your URLs' (visible only on small screens) */}
        <Link
          to="/dashboard#urls"
          className="sm:hidden ml-2 p-2 rounded-md bg-white/5 text-sm"
        >
          Your URLs
        </Link>

        {/* Logout */}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg shadow-md font-semibold transition"
          >
            Logout
          </button>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="text-white hover:text-green-400">
              Login
            </Link>
            <Link to="/register" className="text-white hover:text-green-400">
              Register
            </Link>
          </div>
        )}
        {/* Mobile menu */}
        <button
          className="sm:hidden ml-2 p-2 rounded-md bg-white/5"
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden absolute top-16 right-6 bg-gray-900/90 p-4 rounded-lg shadow-md">
          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="text-white"
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard#urls"
              onClick={() => setOpen(false)}
              className="text-white"
            >
              Your URLs
            </Link>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="text-white"
            >
              Profile
            </Link>
            <Link
              to="/help"
              onClick={() => setOpen(false)}
              className="text-white"
            >
              Help
            </Link>
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="text-white"
            >
              About
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
