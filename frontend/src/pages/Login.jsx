import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", form, {
        withCredentials: true,
      });

      // Debug: log cookies after login
      console.log("After login - document.cookie:", document.cookie);
      console.log("Login response headers:", res.headers);

      if (res.data.user) {
        setUser(res.data.user); // rely on cookie (httpOnly) for auth persistence
        // Verify session cookie is present by calling /auth/me and syncing user
        try {
          const meRes = await axios.get("/auth/me", { withCredentials: true });
          if (meRes.data?.user) setUser(meRes.data.user);
        } catch (e) {
          console.warn(
            "/auth/me after login failed:",
            e.response?.data || e.message
          );
        }
      }
      // Dev helper: server may set 'X-Auth-Set' header to indicate Set-Cookie was sent
      try {
        const authSet =
          res.headers?.["x-auth-set"] || res.headers?.["X-Auth-Set"];
        if (authSet) console.log("Server reported cookie set (X-Auth-Set)");
      } catch (e) {}
      // Note: cookie is set by server (httpOnly) — it will be sent automatically with requests via axios withCredentials

      if (res.data.message === "Log in Successful!") {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error response:", err.response || err);
      const validationErrors = err.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setError(validationErrors.map((e) => e.msg).join(", "));
      } else {
        setError(err.response?.data?.msg || "Something went wrong!");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 animate-fadeIn">
        <h2 className="text-3xl font-bold text-white text-center mb-6 tracking-wide">
          Welcome Back 👋
        </h2>

        {error && (
          <p className="text-red-400 bg-red-900/30 p-2 rounded-lg text-center mb-4">
            {error}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              required
            />
          </div>

          <div>
            <label className="text-gray-200">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold text-lg shadow-md transition-all"
          >
            Login
          </button>

          <p className="text-gray-300 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-400 underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
