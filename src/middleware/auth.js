// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.userRole !== "super-admin") {
    return res.status(403).json({ error: "Only super admin allowed" });
  }
  next();
};

module.exports = { verifyToken, isSuperAdmin };
