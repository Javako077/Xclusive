import express from "express";
import {
  adminLogin,
  adminForgotPassword,
  adminVerifyOtpOnly,
  adminResetPassword,
  getAdminProfile,
  createAdminAccount,
} from "../controllers/adminAuthController.js";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// Admin Login (Email + Password)
router.post("/login", adminLogin);

// Admin Forgot Password Request (OTP)
router.post("/forgot-password", adminForgotPassword);

// Admin Verify OTP Only
router.post("/verify-otp", adminVerifyOtpOnly);

// Admin Reset Password (Verify OTP + Set Password)
router.post("/reset-password", adminResetPassword);

// Get authenticated Admin profile
router.get("/me", protectAdmin, getAdminProfile);

// Secure backend-only Admin Creation API
router.post("/create", createAdminAccount);

export default router;
