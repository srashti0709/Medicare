const express = require("express");

const {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  toggleDepartmentStatus,
} = require("../controllers/departmentController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin creates department
router.post(
  "/",
  protect,
  authorize("admin"),
  createDepartment
);

// Anyone can view departments
router.get("/", getAllDepartments);

// Admin updates department
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateDepartment
);

// Admin activates/deactivates department
router.patch(
  "/:id/toggle-status",
  protect,
  authorize("admin"),
  toggleDepartmentStatus
);

module.exports = router;