import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

// Configure axios defaults used across the app
axios.defaults.withCredentials = true;
// Use VITE_BACKEND_URL for production or fall back to /api proxy for dev
axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Global 401 handler: clear local user state when token invalid
    const interceptorId = axios.interceptors.response.use(
      (resp) => resp,
      async (err) => {
        if (err.response?.status === 401) {
          const url = err.config?.url || "";
          if (!url.includes("/auth/logout")) {
            if (!url.includes("/auth/me")) {
              try {
                await axios.post("/auth/logout", {});
              } catch (e) {}
            }
            setUser(null);
          }
        }
        return Promise.reject(err);
      }
    );

    // Fetch current user (if cookie present)
    (async function fetchUser() {
      try {
        const res = await axios.get("/auth/me");
        setUser(res.data.user || null);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => axios.interceptors.response.eject(interceptorId);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
