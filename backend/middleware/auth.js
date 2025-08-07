// backend/auth.js
import jwt from "jsonwebtoken";

// Load JWT secret from env
const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;

if (!supabaseJwtSecret) {
  throw new Error("Missing SUPABASE_JWT_SECRET in environment variables.");
}

// Middleware to validate access token locally using jwt
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, supabaseJwtSecret); // Local JWT check
    req.user = decoded; // Attach user info to request
    next(); // Proceed to next handler
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default verifyToken;
