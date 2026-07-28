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
import { protect, staffOrAdmin, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protect & staff/admin authorization middleware
router.use(protect);
router.use(staffOrAdmin);

// Dashboard & Analytics
router.get("/stats", getDashboardStats);
router.get("/reports", getAnalyticsReport);

// User Management (Admin only for role/block actions)
router.get("/users", getAllUsers);
router.put("/users/:id/role", admin, updateUserRole);
router.put("/users/:id/block", admin, toggleBlockUser);
router.put("/users/:id/plan", updateUserPlan);
router.delete("/users/:id", admin, deleteUser);

// Booking Management
router.get("/bookings", getAllBookings);
router.put("/bookings/:id/status", updateBookingStatus);
router.delete("/bookings/:id", admin, deleteBooking);

// Contact Inquiries
router.get("/contacts", getAllContacts);

// Content Management
router.get("/content", getContent);
router.post("/content", admin, createContent);
router.delete("/content/:id", admin, deleteContent);

// Notifications & Broadcasts
router.get("/notifications", getNotifications);
router.post("/notifications", admin, sendNotification);
router.delete("/notifications/:id", admin, deleteNotification);

export default router;
