import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  getPlans,
  createOrder,
  verifyPayment,
  handlePaymentFailure,
  handleWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

// Optional Auth Middleware: Attaches req.user if valid token provided, but doesn't block guests
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key_here_123456");
      req.user = await User.findById(decoded.id).select("-password");
    } catch {
      // Ignore token failure for optional auth
    }
  }
  next();
};

// GET canonical membership plans
router.get("/plans", getPlans);

// POST create Razorpay order
router.post("/create-order", optionalAuth, createOrder);

// POST verify Razorpay signature & activate membership
router.post("/verify", optionalAuth, verifyPayment);

// POST log client-side payment failure or cancellation
router.post("/failed", optionalAuth, handlePaymentFailure);

// POST Razorpay webhook endpoint
router.post("/webhook", handleWebhook);

export default router;
