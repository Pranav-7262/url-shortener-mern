// Load environment variables (.env)
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import urlRoutes from "./routes/url.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your local frontend (Vite)
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // http://localhost:5173
    credentials: true,
  })
);

// Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/", urlRoutes);
app.use("/auth", authRoutes);

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
