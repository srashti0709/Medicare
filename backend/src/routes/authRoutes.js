
const express = require("express");
const Joi = require("joi");

const {
    registerUser,
    loginUser,
} = require("../controllers/authController");

const validate = require("../middleware/validateMiddleware");

const router = express.Router();

const registerSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().min(1).max(128).required(),
});

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);

module.exports = router;
