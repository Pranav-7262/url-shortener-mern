import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

// Axios global setup
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Global 401 handler
    const interceptor = axios.interceptors.response.use(
      (resp) => resp,
      async (error) => {
        if (error.response?.status === 401) {
          const url = error.config?.url || "";

          // Avoid logout loops for /auth/me and /auth/logout
          if (!url.includes("/auth/me") && !url.includes("/auth/logout")) {
            try {
              await axios.post("/auth/logout");
            } catch {}
          }

          setUser(null);
        }

        return Promise.reject(error);
      }
    );

    // Fetch user on load
    const loadUser = async () => {
      try {
        const res = await axios.get("/auth/me");
        setUser(res.data.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
