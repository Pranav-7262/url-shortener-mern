import React, { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const handleLogout = async () => {
    await axios.post("/auth/logout", {}, { withCredentials: true });

    setUser(null);
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold">Welcome, {user?.name} 👋</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          You can create new short links, view stats, and manage your account
          from the dashboard.
        </p>

        <div className="mt-6 flex gap-3">
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
          <button onClick={handleLogout} className="btn btn-ghost text-red-500">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
