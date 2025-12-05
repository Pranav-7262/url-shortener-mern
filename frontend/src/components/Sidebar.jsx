import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ className = "" }) => {
  const { user } = useContext(AuthContext);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/user/urls", { withCredentials: true });
        if (!mounted) return;
        setCount(res.data.urls ? res.data.urls.length : 0);
      } catch (err) {
        console.error("Sidebar: failed to fetch user urls:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user]);
  return (
    <aside
      className={`hidden md:flex flex-col w-64 bg-white/5 backdrop-blur-md rounded-lg p-4 gap-4 text-white ${className}`}
    >
      <div className="text-xl font-semibold mb-4">Shorty</div>
      <nav className="flex flex-col gap-2">
        {/* Your URLs — visible for logged-in users — styled as a button with count badge */}
        {user && (
          <Link
            to={{ pathname: "/dashboard", hash: "#urls" }}
            className={`flex items-center justify-between px-3 py-2 rounded-md transition ${
              location.pathname.startsWith("/dashboard")
                ? "bg-green-600 text-white"
                : "bg-green-600/90 text-white hover:bg-green-600"
            }`}
            aria-label="Your URLs"
          >
            <span> Your URLs </span>
            <span className="ml-2 px-2 py-1 rounded-full bg-white/10 text-xs">
              {loading ? "..." : count ?? "-"}
            </span>
          </Link>
        )}
        <Link to="/dashboard" className="hover:text-green-400">
          Dashboard
        </Link>
        <Link to="/profile" className="hover:text-green-400">
          Profile
        </Link>
        <Link to="/settings" className="hover:text-green-400">
          Settings
        </Link>
        <Link to="/help" className="hover:text-green-400">
          Help
        </Link>
        <Link to="/about" className="hover:text-green-400">
          About
        </Link>
      </nav>

      <div className="mt-auto text-xs text-gray-400">v1.0.0</div>
    </aside>
  );
};

export default Sidebar;
