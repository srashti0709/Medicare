const express = require("express");

const {
  createService,
  getAllServices,
  updateService,
  toggleServiceStatus,
} = require("../controllers/serviceController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin creates service
router.post(
  "/",
  protect,
  authorize("admin"),
  createService
);

// Anyone can view services
router.get("/", getAllServices);

// Admin updates service
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateService
);

// Admin activates/deactivates service
router.patch(
  "/:id/toggle-status",
  protect,
  authorize("admin"),
  toggleServiceStatus
);

module.exports = router;