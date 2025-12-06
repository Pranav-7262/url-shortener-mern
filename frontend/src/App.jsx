import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import About from "./pages/About";
import UrlDetails from "./pages/UrlDetails";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// ------------------- Private Route -------------------
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-700 text-lg animate-pulse">Loading...</p>
      </div>
    );

  if (!user) return <Navigate to="/login" />;

  return children;
};

// ------------------- Public Route -------------------
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-700 text-lg animate-pulse">Loading...</p>
      </div>
    );

  if (user) return <Navigate to="/dashboard" />;

  return children;
};

// ------------------- App -------------------
const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <div className="flex flex-1">
              {/* Sidebar responsive: hidden on small screens */}
              <div className="hidden md:block w-64">
                <Sidebar />
              </div>

              <main className="flex-1 p-4">
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />

                  {/* Private Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/home"
                    element={
                      <PrivateRoute>
                        <Home />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/help"
                    element={
                      <PrivateRoute>
                        <Help />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <PrivateRoute>
                        <About />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/stats/:shortId"
                    element={
                      <PrivateRoute>
                        <UrlDetails />
                      </PrivateRoute>
                    }
                  />

                  {/* Default route */}
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </main>
            </div>

            <Footer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
