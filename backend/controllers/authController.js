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
    const { name, email, password, goal } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Will be hashed in User schema pre-save hook
      goal: goal || "Muscle Building & Hypertrophy"
    });

    if (user) {
      res.status(201).json({
        message: "Registration successful",
        token: generateToken(user._id),
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
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
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // User exists, verify password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
    } else {
      // User doesn't exist, auto-signup
      const name = email.split("@")[0].toUpperCase();
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password, // Hashed in pre-save hook
        goal: "Muscle Building & Hypertrophy"
      });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
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
