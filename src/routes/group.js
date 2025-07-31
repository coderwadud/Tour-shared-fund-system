// routes/group.js
const express = require("express");
const router = express.Router();
const { CreateGroup, GroupAdminAssign, GroupList } = require("../controllers/group");
const { protect, checkRole } = require("../middleware/authMiddleware");

router.post("/create", protect, checkRole(['admin', 'super-admin']), CreateGroup);
router.post("/assign-admin", protect, checkRole(['admin', 'super-admin']), GroupAdminAssign);
router.get("/group-list",  GroupList);

module.exports = router;
