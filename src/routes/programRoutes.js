const express = require("express");
const router = express.Router();
const {
  createProgram,
  getAllPrograms,
  getProgramById,
  markGroupAttendance,
  updateProgram
} = require("../controllers/programController");
const { checkRole, protect } = require("../middleware/authMiddleware");

// Create program
router.post("/create", protect, checkRole(['admin', 'super-admin']), createProgram);

// Get all programs (optional: ?groupId=xxx)
router.get("/list", getAllPrograms);

// Get single program with attendee info
router.get("/:id", getProgramById);
// program update
router.put("/:id", updateProgram);

// Mark attendance to a program
router.post("/:id/attend", protect, checkRole(['admin', 'super-admin']), markGroupAttendance);

module.exports = router;
