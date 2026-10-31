const User = require("../models/User");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");

const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      department,
      qualification,
      experience,
      consultationFee,
      about,
      phone,
      profileImage,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !specialization ||
      !department ||
      !qualification ||
      experience === undefined ||
      consultationFee === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required doctor details",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    const doctor = await Doctor.create({
      user: user._id,
      specialization,
      department,
      qualification,
      experience,
      consultationFee,
      about,
      phone,
      profileImage,
    });

    res.status(201).json({
      message: "Doctor created successfully",
      doctor: {
        id: doctor._id,
        userId: user._id,
        name: user.name,
        email: user.email,
        specialization: doctor.specialization,
        department: doctor.department,
        qualification: doctor.qualification,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        about: doctor.about,
        phone: doctor.phone,
        profileImage: doctor.profileImage,
        isAvailable: doctor.isAvailable,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create doctor",
      error: error.message,
    });
  }
};
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
};
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("user", "name email");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      message: "Doctor fetched successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch doctor",
      error: error.message,
    });
  }
};
const updateDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      department,
      qualification,
      experience,
      consultationFee,
      about,
      phone,
      profileImage,
      isAvailable,
    } = req.body;

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const user = await require("../models/User").findById(
      doctor.user
    );

    if (!user) {
      return res.status(404).json({
        message: "Doctor user not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (specialization !== undefined) {
      doctor.specialization = specialization;
    }

    if (department !== undefined) {
      doctor.department = department;
    }

    if (qualification !== undefined) {
      doctor.qualification = qualification;
    }

    if (experience !== undefined) {
      doctor.experience = experience;
    }

    if (consultationFee !== undefined) {
      doctor.consultationFee = consultationFee;
    }

    if (about !== undefined) {
      doctor.about = about;
    }

    if (phone !== undefined) {
      doctor.phone = phone;
    }

    if (profileImage !== undefined) {
      doctor.profileImage = profileImage;
    }

    if (isAvailable !== undefined) {
      doctor.isAvailable = isAvailable;
    }

    await user.save();
    await doctor.save();

    const updatedDoctor = await Doctor.findById(
      doctor._id
    ).populate("user", "name email");

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update doctor",
      error: error.message,
    });
  }
};
const toggleDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    doctor.isAvailable = !doctor.isAvailable;

    await doctor.save();

    const updatedDoctor = await Doctor.findById(
      doctor._id
    ).populate("user", "name email");

    res.status(200).json({
      message: doctor.isAvailable
        ? "Doctor activated successfully"
        : "Doctor deactivated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update doctor availability",
      error: error.message,
    });
  }
};
const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user.id,
    }).populate("user", "name email");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    res.status(200).json({
      message: "Doctor profile fetched successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch doctor profile",
      error: error.message,
    });
  }
};


const updateMyDoctorProfile = async (req, res) => {
  try {
    const {
      name,
      specialization,
      department,
      qualification,
      experience,
      consultationFee,
      about,
      phone,
      profileImage,
      isAvailable,
    } = req.body;

    const doctor = await Doctor.findOne({
      user: req.user.id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    const user = await require("../models/User").findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (specialization !== undefined)
      doctor.specialization = specialization;
    if (department !== undefined)
      doctor.department = department;
    if (qualification !== undefined)
      doctor.qualification = qualification;
    if (experience !== undefined)
      doctor.experience = experience;
    if (consultationFee !== undefined)
      doctor.consultationFee = consultationFee;
    if (about !== undefined) doctor.about = about;
    if (phone !== undefined) doctor.phone = phone;
    if (profileImage !== undefined)
      doctor.profileImage = profileImage;
    if (isAvailable !== undefined)
      doctor.isAvailable = isAvailable;

    await user.save();
    await doctor.save();

    const updatedDoctor = await Doctor.findById(
      doctor._id
    ).populate("user", "name email");

    res.status(200).json({
      message: "Doctor profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update doctor profile",
      error: error.message,
    });
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  toggleDoctorAvailability,
  getMyDoctorProfile,
  updateMyDoctorProfile,
};