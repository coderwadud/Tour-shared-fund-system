// models/Group.js
const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String },
  photo: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Group", groupSchema);
