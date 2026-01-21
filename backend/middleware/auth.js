import jwt from "jsonwebtoken";
const COOKIE_NAME = process.env.COOKIE_NAME || "token";

// Return trimmed JWT secret or falsy
const getJWTSecret = () =>
  process.env.JWT_SECRET && process.env.JWT_SECRET.trim();

export const auth = (req, res, next) => {
  const JWT_SECRET = getJWTSecret();
  if (!JWT_SECRET)
    return res.status(500).json({ msg: "Server JWT secret not configured" });

  // Get token from cookie only
  const token = req.cookies?.[COOKIE_NAME];

  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });

    // Attach minimal user info for route handlers
    req.user = { id: decoded.id };
    return next();
  } catch (err) {
    // Invalid or expired token
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
