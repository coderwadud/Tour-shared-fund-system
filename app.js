const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const groupRoutes = require("./src/routes/groupRoutes");
const programRoutes = require("./src/routes/programRoutes");
const analyticsRoutes = require("./src/routes/analytics");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/program', programRoutes);
app.use("/api/analytics", analyticsRoutes);

module.exports = app;
