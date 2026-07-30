import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendBrevoOtpEmail } from "../config/brevoEmail.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your_jwt_secret_key_here_123456", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password, goal } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: cleanEmail });

    if (userExists) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    // User signup ALWAYS creates a standard athlete user account (never admin)
    const user = await User.create({
      name,
      email: cleanEmail,
      phone: phone ? phone.trim() : "",
      password, // Will be hashed in User schema pre-save hook
      goal: goal || "Muscle Building & Hypertrophy",
      role: "user"
    });

    if (user) {
      res.status(201).json({
        message: "Registration successful",
        token: generateToken(user._id),
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: "user",
          membershipPlan: user.membershipPlan,
          joinDate: user.joinDate,
          goal: user.goal,
          savedPlans: user.savedPlans || []
        }
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error("[Signup Controller Error]", error);
    res.status(500).json({ error: error.message || "Server signup error" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const cleanInput = email.toLowerCase().trim();
    let user = await User.findOne({
      $or: [{ email: cleanInput }, { phone: email.trim() }]
    });

    if (user) {
      if (user.isBlocked) {
        res.status(403).json({ error: "Your account has been suspended by an administrator." });
        return;
      }
      // User exists, verify password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        res.status(401).json({ error: "Invalid email/phone or password" });
        return;
      }
    } else {
      // User doesn't exist, auto-signup as normal user
      const name = email.includes("@") ? email.split("@")[0].toUpperCase() : "ATHLETE";

      user = await User.create({
        name,
        email: cleanInput.includes("@") ? cleanInput : `${cleanInput}@xclusivegym.com`,
        phone: !cleanInput.includes("@") ? cleanInput : "",
        password, // Hashed in pre-save hook
        goal: "Muscle Building & Hypertrophy",
        role: "user"
      });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: "user",
        membershipPlan: user.membershipPlan,
        joinDate: user.joinDate,
        goal: user.goal,
        savedPlans: user.savedPlans || []
      }
    });
  } catch (error) {
    console.error("[Login Controller Error]", error);
    res.status(500).json({ error: error.message || "Server login error" });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || "user",
        membershipPlan: user.membershipPlan,
        joinDate: user.joinDate,
        goal: user.goal,
        savedPlans: user.savedPlans || []
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("[GetMe Controller Error]", error);
    res.status(500).json({ error: "Server error retrieving profile" });
  }
};

// @desc    Send OTP for password recovery via Email or Phone
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = async (req, res) => {
  try {
    const { recoveryTarget, method } = req.body; // method: 'email' | 'phone'

    if (!recoveryTarget) {
      res.status(400).json({ error: "Email or mobile number is required" });
      return;
    }

    const cleanTarget = recoveryTarget.trim().toLowerCase();

    // Search by email or phone
    let user = await User.findOne({
      $or: [
        { email: cleanTarget },
        { phone: recoveryTarget.trim() }
      ]
    });

    if (!user) {
      res.status(404).json({ error: `No account found matching '${recoveryTarget}'. Please register or try another identifier.` });
      return;
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOtp = otp;
    user.resetOtpExpires = expiresAt;
    await user.save();

    // Dispatch email via Brevo SMTP / API
    try {
      if (user.email) {
        await sendBrevoOtpEmail({
          toEmail: user.email,
          recipientName: user.name,
          otp,
          portalType: "USER",
        });
      }
    } catch (mailErr) {
      console.warn("[Brevo Email Notification Warning]", mailErr.message);
    }

    res.json({
      message: `Security OTP code has been dispatched to your email address.`,
      target: user.email,
      otpCode: otp // Demo fallback for local testing
    });
  } catch (error) {
    console.error("[Send OTP Error]", error);
    res.status(500).json({ error: error.message || "Failed to send OTP" });
  }
};

// @desc    Verify OTP code only (Step 3: Verification prior to password reset)
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtpOnly = async (req, res) => {
  try {
    const { recoveryTarget, otp } = req.body;

    if (!recoveryTarget || !otp) {
      return res.status(400).json({ error: "Email and 6-digit OTP code are required." });
    }

    const cleanTarget = recoveryTarget.trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: cleanTarget },
        { phone: recoveryTarget.trim() }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: "User account not found." });
    }

    if (!user.resetOtp || user.resetOtp !== otp.trim()) {
      return res.status(400).json({ error: "Invalid OTP code. Please verify the code and try again." });
    }

    if (!user.resetOtpExpires || new Date() > new Date(user.resetOtpExpires)) {
      return res.status(400).json({ error: "OTP code has expired. Please request a new verification code." });
    }

    return res.json({
      success: true,
      message: "OTP code verified successfully. You can now reset your password."
    });
  } catch (error) {
    console.error("[Verify OTP Only Error]", error);
    return res.status(500).json({ error: error.message || "Failed to verify OTP code." });
  }
};

// @desc    Verify OTP and reset password
// @route   POST /api/auth/verify-otp-reset
// @access  Public
export const verifyOtpAndResetPassword = async (req, res) => {
  try {
    const { recoveryTarget, otp, newPassword } = req.body;

    if (!recoveryTarget || !otp || !newPassword) {
      res.status(400).json({ error: "Email/Phone, OTP code, and new password are required." });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters long." });
      return;
    }

    const cleanTarget = recoveryTarget.trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: cleanTarget },
        { phone: recoveryTarget.trim() }
      ]
    });

    if (!user) {
      res.status(404).json({ error: "User account not found." });
      return;
    }

    if (!user.resetOtp || user.resetOtp !== otp.trim()) {
      res.status(400).json({ error: "Invalid OTP code. Please verify the code and try again." });
      return;
    }

    if (!user.resetOtpExpires || new Date() > new Date(user.resetOtpExpires)) {
      res.status(400).json({ error: "OTP code has expired. Please request a new OTP code." });
      return;
    }

    // Reset password (pre-save hook hashes it)
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({
      message: "Password reset successful! You can now log in with your new password."
    });
  } catch (error) {
    console.error("[Verify OTP Reset Error]", error);
    res.status(500).json({ error: error.message || "Failed to reset password." });
  }
};
