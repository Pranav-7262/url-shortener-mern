import jwt from "jsonwebtoken";
const COOKIE_NAME = process.env.COOKIE_NAME || "token";

// Return trimmed JWT secret or falsy
const getJWTSecret = () =>
  process.env.JWT_SECRET && process.env.JWT_SECRET.trim();

// Cookie-only auth middleware:
// - Read JWT from httpOnly cookie (COOKIE_NAME)
// - Verify signature and attach `req.user = { id }` on success
export const auth = (req, res, next) => {
  const JWT_SECRET = getJWTSecret();
  if (!JWT_SECRET)
    return res.status(500).json({ msg: "Server JWT secret not configured" });

  // Get token from cookie only
  const token = req.cookies?.[COOKIE_NAME];

  // Log cookie state for debugging
  console.log("[AUTH] Request to", req.path, ":");
  console.log("[AUTH]  - Cookie name:", COOKIE_NAME, "value present:", !!token);
  console.log(
    "[AUTH]  - All cookies received:",
    Object.keys(req.cookies || {})
  );
  console.log(
    "[AUTH]  - Authorization header:",
    req.headers.authorization ? "present" : "missing"
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
