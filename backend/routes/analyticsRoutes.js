const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getEmployerAnalytics,
  getPublicStats,
} = require("../controllers/analyticsController");

router.get("/public-stats", getPublicStats);
router.get("/overview", protect, getEmployerAnalytics);

module.exports = router;
