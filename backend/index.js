// Load environment variables early (dotenv/config reads .env)
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import urlRotes from "./routes/url.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

const app = express();
// When behind a proxy (e.g., nginx, or Vite dev proxy), trust proxy so `req.protocol` is accurate
app.set("trust proxy", true);
const PORT = process.env.PORT || 3000;

// Minimal startup info only — do not print secrets
console.log("JWT secret present:", !!process.env.JWT_SECRET);

// Configure allowed origins via `CLIENT_ORIGIN` or comma-separated `ALLOWED_ORIGINS`.
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const allowedOrigins = (process.env.ALLOWED_ORIGINS || clientOrigin)
  .split(",")
  .map((s) => s.trim());
console.log("CORS allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      return allowedOrigins.includes(origin)
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // Expose the debug header so frontend JS (axios) can see it in responses
    exposedHeaders: ["X-Cookie-Set", "X-Auth-Set"],
  })
);

// Parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

// Mount application routes
app.use("/", urlRotes); // URL redirect and management
app.use("/auth", authRoutes); // authentication routes (login/register/logout/me)

// Connect to DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
