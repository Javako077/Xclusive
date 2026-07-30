import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../models/Admin.js";
import { sendBrevoOtpEmail } from "../config/brevoEmail.js";

// Utility to generate Admin JWT Token
const generateAdminToken = (adminId) => {
  return jwt.sign(
    { id: adminId, tokenType: "admin" },
    process.env.JWT_SECRET || "your_jwt_secret_key_here_123456",
    { expiresIn: "7d" }
  );
};

/**
 * @desc Admin Login (Email + Password)
 * @route POST /api/admin/auth/login
 * @access Public
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both admin email and password." });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Query strictly from Admin collection
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      return res.status(401).json({ error: "Email or password wrong." });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email or password wrong." });
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateAdminToken(admin._id);

    return res.json({
      message: "Admin authentication successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("[Admin Login Error]", error);
    return res.status(500).json({ error: "Server error during admin authentication." });
  }
};

/**
 * @desc Request OTP for Admin Forgot Password
 * @route POST /api/admin/auth/forgot-password
 * @access Public
 */
export const adminForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Admin email address is required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      return res.status(404).json({ error: "No registered Admin account found with that email address." });
    }

    // Generate 6-digit numeric OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    admin.resetOtp = otp;
    admin.resetOtpExpires = expiresAt;
    await admin.save();

    // Dispatch email via Brevo SMTP / API
    try {
      await sendBrevoOtpEmail({
        toEmail: admin.email,
        recipientName: admin.name,
        otp,
        portalType: "ADMIN",
      });
    } catch (mailErr) {
      console.warn("[Admin Brevo Email Warning]", mailErr.message);
    }

    return res.json({
      message: `Security verification OTP has been dispatched to ${cleanEmail}.`,
      otpCode: otp,
      expiresInMinutes: 10,
    });
  } catch (error) {
    console.error("[Admin Forgot Password Error]", error);
    return res.status(500).json({ error: "Failed to process admin password reset request." });
  }
};

/**
 * @desc Verify Admin OTP Only (Step 3 prior to password reset)
 * @route POST /api/admin/auth/verify-otp
 * @access Public
 */
export const adminVerifyOtpOnly = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and 6-digit OTP code are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      return res.status(404).json({ error: "Admin account not found." });
    }

    if (!admin.resetOtp || admin.resetOtp !== otp.trim()) {
      return res.status(400).json({ error: "Invalid OTP code. Please verify the code and try again." });
    }

    if (!admin.resetOtpExpires || admin.resetOtpExpires < new Date()) {
      return res.status(400).json({ error: "OTP code has expired. Please request a new verification code." });
    }

    return res.json({
      success: true,
      message: "Admin OTP code verified successfully. You can now reset your password."
    });
  } catch (error) {
    console.error("[Admin Verify OTP Error]", error);
    return res.status(500).json({ error: "Failed to verify admin OTP code." });
  }
};

/**
 * @desc Verify OTP & Reset Admin Password
 * @route POST /api/admin/auth/reset-password
 * @access Public
 */
export const adminResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Email, OTP code, and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      return res.status(404).json({ error: "Admin account not found." });
    }

    if (!admin.resetOtp || admin.resetOtp !== otp.trim()) {
      return res.status(400).json({ error: "Invalid OTP code. Please verify the code and try again." });
    }

    if (!admin.resetOtpExpires || admin.resetOtpExpires < new Date()) {
      return res.status(400).json({ error: "OTP code has expired. Please request a new verification code." });
    }

    // Set new password (will be hashed automatically by pre-save hook)
    admin.password = newPassword;
    admin.resetOtp = null;
    admin.resetOtpExpires = null;
    await admin.save();

    return res.json({
      message: "Admin password successfully updated. You may now log in with your new credentials.",
    });
  } catch (error) {
    console.error("[Admin Reset Password Error]", error);
    return res.status(500).json({ error: "Failed to reset admin password." });
  }
};

/**
 * @desc Get currently logged in admin profile
 * @route GET /api/admin/auth/me
 * @access Protected (Admin)
 */
export const getAdminProfile = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Not authorized as Admin." });
    }
    return res.json({
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        lastLogin: req.admin.lastLogin,
        createdAt: req.admin.createdAt,
      },
    });
  } catch (error) {
    console.error("[Get Admin Profile Error]", error);
    return res.status(500).json({ error: "Failed to retrieve admin profile." });
  }
};

/**
 * @desc Backend-only API endpoint to create Admin accounts (Never exposed via public frontend forms)
 * @route POST /api/admin/auth/create
 * @access Backend / Secret Header Key
 */
export const createAdminAccount = async (req, res) => {
  try {
    const secretKeyHeader = req.headers["x-admin-secret-key"];
    const expectedSecret = process.env.ADMIN_INIT_KEY || "xclusive_admin_secret_key_2026";

    // Allow call if secret key header matches OR if superadmin is logged in
    const isAuthorizedSecret = secretKeyHeader && secretKeyHeader === expectedSecret;
    const isAuthorizedSuperadmin = req.admin && req.admin.role === "superadmin";

    if (!isAuthorizedSecret && !isAuthorizedSuperadmin) {
      return res.status(403).json({ error: "Forbidden. Admin account creation requires backend authorization." });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required to create an Admin." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: cleanEmail });

    if (existing) {
      return res.status(409).json({ error: "An Admin account with this email already exists." });
    }

    const newAdmin = new Admin({
      name,
      email: cleanEmail,
      password,
      role: role || "admin",
    });

    await newAdmin.save();

    return res.status(201).json({
      message: "New Admin account created successfully.",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("[Create Admin Account Error]", error);
    return res.status(500).json({ error: "Failed to create Admin account." });
  }
};
