import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

// Button that toggles theme via ThemeContext
const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme} className="p-2 rounded-md bg-white/5">
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggle;
