import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleBlockUser,
  updateUserPlan,
  deleteUser,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getAllContacts,
  getContent,
  createContent,
  deleteContent,
  getNotifications,
  sendNotification,
  deleteNotification,
  getAnalyticsReport,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// Apply strict Admin authentication middleware to all admin dashboard routes
router.use(protectAdmin);

// Dashboard & Analytics
router.get("/stats", getDashboardStats);
router.get("/reports", getAnalyticsReport);

// User Management
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/block", toggleBlockUser);
router.put("/users/:id/plan", updateUserPlan);
router.delete("/users/:id", deleteUser);

// Booking Management
router.get("/bookings", getAllBookings);
router.put("/bookings/:id/status", updateBookingStatus);
router.delete("/bookings/:id", deleteBooking);

// Contact Inquiries
router.get("/contacts", getAllContacts);

// Content Management
router.get("/content", getContent);
router.post("/content", createContent);
router.delete("/content/:id", deleteContent);

// Notifications & Broadcasts
router.get("/notifications", getNotifications);
router.post("/notifications", sendNotification);
router.delete("/notifications/:id", deleteNotification);

export default router;
