import jwt from "jsonwebtoken";
const COOKIE_NAME = process.env.COOKIE_NAME || "token";

// Return trimmed JWT secret or falsy
const getJWTSecret = () =>
  process.env.JWT_SECRET && process.env.JWT_SECRET.trim();

// Simple cookie-only auth middleware:
// - Reads JWT from httpOnly cookie (no Authorization header fallback)
// - Verifies signature with HS256 and attaches `req.user = { id }` on success
export const auth = (req, res, next) => {
  const JWT_SECRET = getJWTSecret();
  if (!JWT_SECRET)
    return res.status(500).json({ msg: "Server JWT secret not configured" });

  // Token must be present in cookie named by COOKIE_NAME
  const token = req.cookies?.[COOKIE_NAME];
  console.log(
    "Auth check - All cookies:",
    req.cookies,
    "Token cookie:",
    COOKIE_NAME,
    "=",
    token ? "present" : "MISSING"
  );
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    console.log("decoded :", decoded);
    // Attach minimal user info for route handlers
    req.user = { id: decoded.id };
    return next();
  } catch (err) {
    // Invalid or expired token
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
