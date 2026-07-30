import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { seedInitialAdmin } from "./config/seedAdmin.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

// Connect to Database & Seed Initial Admin
connectDB().then(() => {
  seedInitialAdmin();
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    stack: "MERN Stack (Express.js + Node.js + MongoDB)",
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use("/api/auth", authRoutes); // User Authentication (Login, Signup, OTP)
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/bookings", bookingRoutes);

// Admin Dedicated Routes (Completely separate from User Auth)
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start Server with Graceful Port Error Handling
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Standalone Node.js Backend] Server running on http://0.0.0.0:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`[Server Port Conflict] Port ${PORT} is already in use by another running instance.`);
  } else {
    console.error("[Server Error]", error);
  }
});
