import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ className = "" }) => {
  const { user } = useContext(AuthContext);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    let mounted = true;
    const loadUserUrls = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/user/urls");
        if (!mounted) return;
        setCount(res.data.urls?.length ?? 0);
      } catch (err) {
        console.error("Sidebar: failed to fetch user URLs:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUserUrls();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Helper for active link styles
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside
      className={`hidden md:flex flex-col w-64 bg-white/5 backdrop-blur-md rounded-lg p-4 gap-4 text-white ${className}`}
    >
      <div className="text-xl font-semibold mb-4">Shorty</div>

      <nav className="flex flex-col gap-2">
        {/* User URLs link with badge */}
        {user && (
          <Link
            to={{ pathname: "/dashboard", hash: "#urls" }}
            className={`flex items-center justify-between px-3 py-2 rounded-md transition ${
              isActive("/dashboard")
                ? "bg-green-600 text-white"
                : "bg-green-600/90 text-white hover:bg-green-600"
            }`}
            aria-label="Your URLs"
          >
            <span>Your URLs</span>
            <span className="ml-2 px-2 py-1 rounded-full bg-white/10 text-xs">
              {loading ? "..." : count}
            </span>
          </Link>
        )}

        {/* Navigation links */}
        <Link
          to="/dashboard"
          className={`px-3 py-2 rounded-md transition ${
            isActive("/dashboard")
              ? "bg-green-600 text-white"
              : "hover:text-green-400"
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/profile"
          className={`px-3 py-2 rounded-md transition ${
            isActive("/profile")
              ? "bg-green-600 text-white"
              : "hover:text-green-400"
          }`}
        >
          Profile
        </Link>

        <Link
          to="/settings"
          className={`px-3 py-2 rounded-md transition ${
            isActive("/settings")
              ? "bg-green-600 text-white"
              : "hover:text-green-400"
          }`}
        >
          Settings
        </Link>

        <Link
          to="/help"
          className={`px-3 py-2 rounded-md transition ${
            isActive("/help")
              ? "bg-green-600 text-white"
              : "hover:text-green-400"
          }`}
        >
          Help
        </Link>

        <Link
          to="/about"
          className={`px-3 py-2 rounded-md transition ${
            isActive("/about")
              ? "bg-green-600 text-white"
              : "hover:text-green-400"
          }`}
        >
          About
        </Link>
      </nav>

      <div className="mt-auto text-xs text-gray-400">v1.0.0</div>
    </aside>
  );
};

export default Sidebar;
