import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

// Configure axios defaults used across the app
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
if (!import.meta.env.VITE_BACKEND_URL) {
  console.warn("⚠️ VITE_BACKEND_URL is missing!");
}
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Global 401 handler: clear local user state when token invalid
    const responseInterceptorId = axios.interceptors.response.use(
      (resp) => resp,
      async (err) => {
        if (err.response?.status === 401) {
          const url = err.config?.url || "";
          if (!url.includes("/auth/logout")) {
            if (!url.includes("/auth/me")) {
              try {
                await axios.post("/auth/logout", {}, { withCredentials: true });
              } catch (e) {}
            }
            setUser(null);
          }
        }
        return Promise.reject(err);
      }
    );

    // Fetch current user (using cookies)
    (async function fetchUser() {
      try {
        const res = await axios.get("/auth/me", { withCredentials: true });
        console.log("JWT Secret:", process.env.JWT_SECRET);

        setUser(res.data.user || null);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      axios.interceptors.response.eject(responseInterceptorId);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
