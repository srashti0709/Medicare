
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// ===============================
// Get Own Profile
// ===============================
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};

// ===============================
// Update Own Profile
// ===============================
const updateProfile = async (req, res) => {
    try {
        const { name, profileImage } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required",
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.name = name.trim();

        if (profileImage !== undefined) {
            user.profileImage = profileImage.trim();
        }

        await user.save();

        const updatedUser = await User.findById(user._id).select(
            "-password"
        );

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message,
        });
    }
};

// ===============================
// Admin: Get All Patients
// ===============================
const getAllPatients = async (req, res) => {
    try {
        const patients = await User.find({
            role: "patient",
        })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Patients fetched successfully",
            patients,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patients",
            error: error.message,
        });
    }
};

// ===============================
// Admin: Get Patient By ID
// ===============================
const getPatientById = async (req, res) => {
    try {
        const patient = await User.findOne({
            _id: req.params.id,
            role: "patient",
        }).select("-password");

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }

        res.status(200).json({
            message: "Patient fetched successfully",
            patient,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patient",
            error: error.message,
        });
    }
};

// ===============================
// Admin: Update Patient
// ===============================
const updatePatient = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required",
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const patient = await User.findOne({
            _id: req.params.id,
            role: "patient",
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }

        const existingUser = await User.findOne({
            email: email.trim().toLowerCase(),
            _id: { $ne: patient._id },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email is already in use",
            });
        }

        patient.name = name.trim();
        patient.email = email.trim().toLowerCase();

        await patient.save();

        const updatedPatient = await User.findById(patient._id).select(
            "-password"
        );

        res.status(200).json({
            message: "Patient updated successfully",
            patient: updatedPatient,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update patient",
            error: error.message,
        });
    }
};

// ===============================
// Admin: Toggle Patient Status
// ===============================
const togglePatientStatus = async (req, res) => {
    try {
        const patient = await User.findOne({
            _id: req.params.id,
            role: "patient",
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }

        patient.isActive = !patient.isActive;

        await patient.save();

        res.status(200).json({
            message: `Patient ${patient.isActive ? "activated" : "deactivated"
                } successfully`,
            patient: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                role: patient.role,
                isActive: patient.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update patient status",
            error: error.message,
        });
    }
};

// ===============================
// Admin: Delete Patient
// ===============================
const deletePatient = async (req, res) => {
    try {
        const patient = await User.findOne({
            _id: req.params.id,
            role: "patient",
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }

        const existingAppointments = await Appointment.findOne({
            patient: patient._id,
        });

        if (existingAppointments) {
            return res.status(400).json({
                message:
                    "This patient has existing appointments and cannot be deleted. Deactivate the account instead.",
            });
        }

        await User.findByIdAndDelete(patient._id);

        res.status(200).json({
            message: "Patient deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete patient",
            error: error.message,
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAllPatients,
    getPatientById,
    updatePatient,
    togglePatientStatus,
    deletePatient,
};
