// routes/group.js
const express = require("express");
const router = express.Router();
const { CreateGroup, GroupAdminAssign, GroupList, getGroupById, updateGroup, deleteGroup } = require("../controllers/groupController");
const { protect, checkRole } = require("../middleware/authMiddleware");

router.post("/create", protect, checkRole(['admin', 'super-admin']), CreateGroup);
router.post("/assign-admin", protect, checkRole(['admin', 'super-admin']), GroupAdminAssign);
router.get("/group-list", protect, checkRole(['admin', 'super-admin']),  GroupList);
router.get("/:groupId",  getGroupById);
router.put("/:groupId",  updateGroup);
router.delete("/:groupId",  deleteGroup);

module.exports = router;
