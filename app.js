const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const user = require("./src/routes/userRoutes");
const group = require("./src/routes/group");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/users', user);
app.use('/api/group/', group);

module.exports = app;
