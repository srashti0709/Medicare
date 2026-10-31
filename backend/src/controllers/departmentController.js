const Department = require("../models/Department");

// Create department
const createDepartment = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Department name is required",
      });
    }

    const existingDepartment = await Department.findOne({
      name: name.trim(),
    });

    if (existingDepartment) {
      return res.status(400).json({
        message: "Department already exists",
      });
    }

    const department = await Department.create({
      name: name.trim(),
      description,
      image,
    });

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create department",
      error: error.message,
    });
  }
};

// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Departments fetched successfully",
      departments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
};
const updateDepartment = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    if (name !== undefined) {
      const existingDepartment = await Department.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (existingDepartment) {
        return res.status(400).json({
          message: "Department already exists",
        });
      }

      department.name = name.trim();
    }

    if (description !== undefined) {
      department.description = description;
    }

    if (image !== undefined) {
      department.image = image;
    }

    if (isActive !== undefined) {
      department.isActive = isActive;
    }

    await department.save();

    res.status(200).json({
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update department",
      error: error.message,
    });
  }
};
const toggleDepartmentStatus = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    department.isActive = !department.isActive;

    await department.save();

    res.status(200).json({
      message: department.isActive
        ? "Department activated successfully"
        : "Department deactivated successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update department status",
      error: error.message,
    });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  toggleDepartmentStatus,
};