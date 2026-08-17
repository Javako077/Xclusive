import express from "express";
import { signup, login, getMe, sendOtp, verifyOtpOnly, verifyOtpAndResetPassword, socialLogin } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/social-login", socialLogin);
router.get("/me", protect, getMe);
router.post("/send-otp", sendOtp);
router.post("/forgot-password", sendOtp);
router.post("/verify-otp", verifyOtpOnly);
router.post("/verify-otp-reset", verifyOtpAndResetPassword);

export default router;

