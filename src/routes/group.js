// routes/group.js
const express = require("express");
const router = express.Router();
const { CreateGroup, GroupAdminAssign } = require("../controllers/group");
const { protect, checkRole } = require("../middleware/authMiddleware");

router.post("/create", protect, checkRole(['admin', 'super-admin']), CreateGroup);
router.post("/assign-admin", protect, checkRole(['admin', 'super-admin']), GroupAdminAssign);

module.exports = router;
