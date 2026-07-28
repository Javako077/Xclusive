import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
    const { name, email, phone, password, goal, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    const userRole = role && ["user", "staff", "admin"].includes(role) ? role : "user";

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone ? phone.trim() : "",
      password, // Will be hashed in User schema pre-save hook
      goal: goal || "Muscle Building & Hypertrophy",
      role: userRole
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
          role: user.role || "user",
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

// @desc    Authenticate user & get token (auto-signup if doesn't exist)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

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

      // If login specifies role and user's database role differs, update role if requested or match
      if (role && ["admin", "staff", "user"].includes(role) && user.role !== role) {
        user.role = role;
        await user.save();
      }
    } else {
      // User doesn't exist, auto-signup with specified role or default
      const name = email.includes("@") ? email.split("@")[0].toUpperCase() : "ATHLETE";
      const userRole = role && ["user", "staff", "admin"].includes(role) ? role : "user";
      user = await User.create({
        name,
        email: cleanInput.includes("@") ? cleanInput : `${cleanInput}@xclusivegym.com`,
        phone: !cleanInput.includes("@") ? cleanInput : "",
        password, // Hashed in pre-save hook
        goal: "Muscle Building & Hypertrophy",
        role: userRole
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
        role: user.role || "user",
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

    console.log(`[OTP Sent Successfully] Target: ${recoveryTarget} | Method: ${method} | OTP Code: ${otp}`);

    res.json({
      message: `OTP code sent to your ${method === 'phone' ? 'mobile number' : 'email address'}.`,
      target: recoveryTarget,
      method: method || 'email',
      demoOtp: otp // Returned for easy testing and demonstration in UI
    });
  } catch (error) {
    console.error("[Send OTP Error]", error);
    res.status(500).json({ error: error.message || "Failed to send OTP" });
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
