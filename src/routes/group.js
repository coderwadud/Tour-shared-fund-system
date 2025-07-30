// routes/group.js
const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const User = require("../models/User");
const { verifyToken, isSuperAdmin } = require("../middleware/auth");

router.post("/create", verifyToken, isSuperAdmin, async (req, res) => {
  try {
    const { name, location } = req.body;

    // Prevent duplicate group names
    const existing = await Group.findOne({ name });
    if (existing) return res.status(400).json({ error: "Group name already exists." });

    const group = new Group({
      name,
      location,
      createdBy: req.userId,
    });

    await group.save();
    res.status(201).json({ message: "Group created", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/assign-admin", verifyToken, isSuperAdmin, async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    const user = await User.findById(userId);
    const group = await Group.findById(groupId);

    if (!user || !group) {
      return res.status(404).json({ error: "User or Group not found" });
    }

    user.role = "admin";
    user.groupId = groupId;

    await user.save();

    res.status(200).json({ message: "User assigned as group admin", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
