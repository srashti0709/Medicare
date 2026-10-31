const Service = require("../models/Service");
const Department = require("../models/Department");

// Create service

const createService = async (req, res) => {
  try {
    const { name, description, department, image } = req.body;

    if (!name || !description || !department) {
      return res.status(400).json({
        message: "Name, description and department are required",
      });
    }

    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    const existingService = await Service.findOne({
      name: name.trim(),
      department,
    });

    if (existingService) {
      return res.status(400).json({
        message: "Service already exists in this department",
      });
    }

    const service = await Service.create({
      name: name.trim(),
      description: description.trim(),
      department,
      image,
    });

    const populatedService = await Service.findById(
      service._id
    ).populate("department", "name");

    res.status(201).json({
      message: "Service created successfully",
      service: populatedService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create service",
      error: error.message,
    });
  }
};

// Get all services

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Services fetched successfully",
      services,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

// Update service

const updateService = async (req, res) => {
  try {
    const {
      name,
      description,
      department,
      image,
      isActive,
    } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    if (department !== undefined) {
      const departmentExists = await Department.findById(
        department
      );

      if (!departmentExists) {
        return res.status(404).json({
          message: "Department not found",
        });
      }
    }

    if (name !== undefined || department !== undefined) {
      const serviceName = name !== undefined
        ? name.trim()
        : service.name;

      const serviceDepartment =
        department !== undefined
          ? department
          : service.department;

      const existingService = await Service.findOne({
        name: serviceName,
        department: serviceDepartment,
        _id: { $ne: req.params.id },
      });

      if (existingService) {
        return res.status(400).json({
          message:
            "Service already exists in this department",
        });
      }
    }

    if (name !== undefined) {
      service.name = name.trim();
    }

    if (description !== undefined) {
      service.description = description.trim();
    }

    if (department !== undefined) {
      service.department = department;
    }

    if (image !== undefined) {
      service.image = image;
    }

    if (isActive !== undefined) {
      service.isActive = isActive;
    }

    await service.save();

    const updatedService = await Service.findById(
      service._id
    ).populate("department", "name");

    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update service",
      error: error.message,
    });
  }
};

// Toggle service status

const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    service.isActive = !service.isActive;

    await service.save();

    const updatedService = await Service.findById(
      service._id
    ).populate("department", "name");

    res.status(200).json({
      message: service.isActive
        ? "Service activated successfully"
        : "Service deactivated successfully",
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update service status",
      error: error.message,
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  updateService,
  toggleServiceStatus,
};