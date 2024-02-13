const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const UserModel = require("../models/userModel");

const JWT_SECRET = "your_jwt_secret"; // Manually set JWT secret key

const userController = {
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user instance with hashed password and OTP
      const user = new UserModel({
        name,
        email,
        password: hashedPassword,
        verificationCode: otp, // Save OTP in the user document
      });
      await user.save();

      // Create a transporter for sending emails
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "your_email", // Your Gmail email address
          pass: "Your_generated_app_password", // Your generated app password
        },
      });

      // Send OTP via email
      await transporter.sendMail({
        from: "sender_email",
        to: email,
        subject: "Email Verification OTP",
        text: `Your OTP for email verification is: ${otp}`,
      });

      res.status(201).json({ message: "OTP sent to email for verification" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Signup failed: " + error.message });
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      // Find user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Check if OTP matches
      if (user.verificationCode !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Mark user as verified and clear verificationCode
      user.isVerified = true;
      user.verificationCode = ""; // Clear OTP after verification
      await user.save();

      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ message: "OTP verification failed: " + error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Check if user is verified
      if (!user.isVerified) {
        return res.status(400).json({ message: "Email not verified" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed: " + error.message });
    }
  },

  // Other controller methods...
};

module.exports = userController;
