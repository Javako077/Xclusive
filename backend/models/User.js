import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SavedPlanSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => "plan_" + Date.now() + Math.random().toString(36).substring(2, 5)
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    default: () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  membershipPlan: {
    type: String,
    default: "PRO ATHLETE PASS"
  },
  joinDate: {
    type: String,
    default: () => new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
  },
  goal: {
    type: String,
    default: "Muscle Building & Hypertrophy"
  },
  phone: {
    type: String,
    trim: true,
    default: ""
  },
  resetOtp: {
    type: String,
    default: null
  },
  resetOtpExpires: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: ["user", "staff", "admin"],
    default: "user"
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  savedPlans: [SavedPlanSchema]
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
