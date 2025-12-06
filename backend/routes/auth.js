import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

// JWT configuration and cookie name
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";
const COOKIE_NAME = process.env.COOKIE_NAME || "token";
// Return trimmed JWT secret or falsy — ensure dotenv has been loaded
const getJWTSecret = () =>
  process.env.JWT_SECRET && process.env.JWT_SECRET.trim();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ], // this is for a validations
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() }); //checking validation errors
    const { name, email, password } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing)
        return res.status(400).json({ msg: "Email already registered" });
      const salt = await bcrypt.genSalt(10); // generating salt
      const hashed = await bcrypt.hash(password, salt); // hashing password

      // create user record with hashed password
      const user = new User({ name, email, password: hashed });
      await user.save();

      // sign JWT and set httpOnly cookie for session
      const payload = { id: user._id };
      const JWT_SECRET = getJWTSecret();
      if (!JWT_SECRET)
        return res
          .status(500)
          .json({ msg: "Server JWT secret not configured" });
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: "HS256",
      });

      // Cookie options: httpOnly to prevent JS access, secure/sameSite for cross-site cookies
      // On Render: set RENDER_DEPLOYMENT=true or SECURE_COOKIES=true to enable secure: true
      const isSecure =
        process.env.RENDER_DEPLOYMENT === "true" ||
        process.env.SECURE_COOKIES === "true" ||
        process.env.NODE_ENV === "production";
      const cookieOptions = {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      console.log(
        "Setting cookie:",
        COOKIE_NAME,
        "with options:",
        cookieOptions,
        "NODE_ENV:",
        process.env.NODE_ENV
      );
      res.cookie(COOKIE_NAME, token, cookieOptions);
      // Send a header so we can see cookie was set
      res.setHeader("X-Cookie-Set", COOKIE_NAME);
      if (process.env.NODE_ENV !== "production")
        res.setHeader("X-Auth-Set", "1");

      res.status(201).json({
        msg: "User registered successfully",
        user: { id: user._id, name: user.name, email: user.email },
        token: token, // Frontend will store this and use in Authorization header if needed
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error !" });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").exists().withMessage("Password required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      // lookup user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });

      const isMatch = await user.comparePassword(password); // using the method defined in user model to compare password
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
      // create token for authenticated user and set cookie
      const payload = { id: user._id };
      const JWT_SECRET = getJWTSecret();
      if (!JWT_SECRET)
        return res
          .status(500)
          .json({ msg: "Server JWT secret not configured" });
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: "HS256",
      });
      const cookieOptions = {
        httpOnly: true,
        secure:
          process.env.RENDER_DEPLOYMENT === "true" ||
          process.env.SECURE_COOKIES === "true" ||
          process.env.NODE_ENV === "production",
        sameSite:
          process.env.RENDER_DEPLOYMENT === "true" ||
          process.env.SECURE_COOKIES === "true" ||
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      console.log(
        "Setting cookie:",
        COOKIE_NAME,
        "with options:",
        cookieOptions,
        "NODE_ENV:",
        process.env.NODE_ENV
      );
      res.cookie(COOKIE_NAME, token, cookieOptions);
      // Send a header so we can see cookie was set
      res.setHeader("X-Cookie-Set", COOKIE_NAME);
      if (process.env.NODE_ENV !== "production")
        res.setHeader("X-Auth-Set", "1");
      // Include token in response so frontend can use it as Authorization header if cookie fails
      res.json({
        message: "Log in Successful!",
        user: { id: user._id, name: user.name, email: user.email },
        token: token, // Frontend will store this and use in Authorization header if needed
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Logout
router.post("/logout", (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure:
      process.env.RENDER_DEPLOYMENT === "true" ||
      process.env.SECURE_COOKIES === "true" ||
      process.env.NODE_ENV === "production",
    sameSite:
      process.env.RENDER_DEPLOYMENT === "true" ||
      process.env.SECURE_COOKIES === "true" ||
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.json({ msg: "Logged out" });
}); // clearing the cookie

// Middleware to verify JWT from cookies , for current user route
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ user }); // return user data
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Auth routes complete - cookie-based only

export default router;
