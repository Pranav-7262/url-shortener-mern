import jwt from "jsonwebtoken";
const COOKIE_NAME = process.env.COOKIE_NAME || "token";

// Return trimmed JWT secret or falsy
const getJWTSecret = () =>
  process.env.JWT_SECRET && process.env.JWT_SECRET.trim();

// Cookie-first auth middleware, with Authorization header fallback:
// - Try to read JWT from httpOnly cookie (COOKIE_NAME)
// - Fall back to Authorization: Bearer <token> header
// - Verify signature and attach `req.user = { id }` on success
export const auth = (req, res, next) => {
  const JWT_SECRET = getJWTSecret();
  if (!JWT_SECRET)
    return res.status(500).json({ msg: "Server JWT secret not configured" });

  // Try cookie first (most secure), then Authorization header
  let token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
    }
  }
  console.log(
    "Auth check - Cookie:",
    COOKIE_NAME,
    "=",
    req.cookies?.[COOKIE_NAME] ? "present" : "missing",
    "Authorization header:",
    req.headers.authorization ? "present" : "missing",
    "Token resolved:",
    token ? "yes" : "NO"
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
