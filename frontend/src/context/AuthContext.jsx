import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

// Configure axios defaults used across the app
axios.defaults.withCredentials = true;
// Use VITE_BACKEND_URL for production or fall back to /api proxy for dev
axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "/api";

// Load token from localStorage on app start (if present)
const loadStoredToken = () => {
  try {
    return localStorage.getItem("authToken") || null;
  } catch (e) {
    return null;
  }
};

// Save token to localStorage
const saveToken = (token) => {
  try {
    if (token) {
      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
    }
  } catch (e) {
    console.error("Failed to save token:", e);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount: restore token from localStorage and set Authorization header
    const storedToken = loadStoredToken();
    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    // Global 401 handler: clear local user state and token when auth fails
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
            saveToken(null); // Clear token on 401
            setUser(null);
          }
        }
        return Promise.reject(err);
      }
    );

    // Fetch current user (cookie or token in localStorage)
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
    <AuthContext.Provider value={{ user, setUser, loading, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
