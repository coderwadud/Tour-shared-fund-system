const express = require("express");
const { getDashboardStats, getDashboardStatsDetailed, getDashboardHighlights } = require("../controllers/analyticsController");
const router = express.Router();

router.get("/dashboard-stats", getDashboardStats);
router.get("/dashboard-detailed", getDashboardStatsDetailed);
router.get("/dashboard-highlights", getDashboardHighlights);

module.exports = router;
