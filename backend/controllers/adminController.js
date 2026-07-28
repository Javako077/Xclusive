import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Contact from "../models/Contact.js";
import Content from "../models/Content.js";
import Notification from "../models/Notification.js";

// @desc    Get Admin Dashboard Overview Statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const activeMembers = await User.countDocuments({ isBlocked: { $ne: true } });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalBookings,
        totalContacts,
        activeMembers,
        blockedUsers,
        estimatedRevenue: totalBookings * 149 + activeMembers * 199,
      },
      recentBookings,
      recentUsers,
    });
  } catch (error) {
    console.error("[Admin Stats Error]", error);
    res.status(500).json({ error: "Failed to load admin statistics" });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("[Admin Get Users Error]", error);
    res.status(500).json({ error: "Failed to retrieve users list" });
  }
};

// @desc    Update user role (user, staff, admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "staff", "admin"].includes(role)) {
      res.status(400).json({ error: "Invalid role specified. Must be user, staff, or admin." });
      return;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.role = role;
    await user.save();

    res.json({
      message: `User role updated to ${role.toUpperCase()}`,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[Admin Update Role Error]", error);
    res.status(500).json({ error: "Failed to update user role" });
  }
};

// @desc    Toggle Block / Unblock user account
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? "User account has been blocked/suspended." : "User account has been unblocked.",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error("[Admin Toggle Block Error]", error);
    res.status(500).json({ error: "Failed to update block status" });
  }
};

// @desc    Update user membership plan
// @route   PUT /api/admin/users/:id/plan
// @access  Private/Admin
export const updateUserPlan = async (req, res) => {
  try {
    const { membershipPlan } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.membershipPlan = membershipPlan;
    await user.save();

    res.json({ message: "User membership plan updated", membershipPlan: user.membershipPlan });
  } catch (error) {
    console.error("[Admin Update Plan Error]", error);
    res.status(500).json({ error: "Failed to update user plan" });
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("[Admin Delete User Error]", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("[Admin Get Bookings Error]", error);
    res.status(500).json({ error: "Failed to retrieve bookings" });
  }
};

// @desc    Update booking status (pending, approved, rejected, cancelled)
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected", "cancelled"].includes(status)) {
      res.status(400).json({ error: "Invalid booking status specified." });
      return;
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    console.error("[Admin Update Booking Status Error]", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
};

// @desc    Delete/cancel booking
// @route   DELETE /api/admin/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking removed successfully" });
  } catch (error) {
    console.error("[Admin Delete Booking Error]", error);
    res.status(500).json({ error: "Failed to delete booking" });
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/admin/contacts
// @access  Private/Admin
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error("[Admin Get Contacts Error]", error);
    res.status(500).json({ error: "Failed to retrieve contact inquiries" });
  }
};

// ==========================================
// CONTENT MANAGEMENT CONTROLLERS
// ==========================================
export const getContent = async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch website contents" });
  }
};

export const createContent = async (req, res) => {
  try {
    const { title, category, body, active } = req.body;
    if (!title || !body) {
      res.status(400).json({ error: "Title and body content are required." });
      return;
    }

    const content = await Content.create({
      title,
      category: category || "announcement",
      body,
      active: active !== undefined ? active : true,
      author: req.user?.name || "Admin Team",
    });

    res.status(201).json({ message: "Content created successfully", content });
  } catch (error) {
    res.status(500).json({ error: "Failed to create content item" });
  }
};

export const deleteContent = async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: "Content item deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete content" });
  }
};

// ==========================================
// NOTIFICATIONS & BROADCAST CONTROLLERS
// ==========================================
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { title, message, targetAudience, type } = req.body;
    if (!title || !message) {
      res.status(400).json({ error: "Notification title and message are required." });
      return;
    }

    const notification = await Notification.create({
      title,
      message,
      targetAudience: targetAudience || "all",
      type: type || "info",
      sentBy: req.user?.name || "System Admin",
    });

    console.log(`[Broadcast Sent] Title: ${title} | Target: ${targetAudience}`);
    res.status(201).json({ message: "Notification broadcasted successfully!", notification });
  } catch (error) {
    res.status(500).json({ error: "Failed to send notification" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification removed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

// ==========================================
// REPORTS & ANALYTICS DATA CONTROLLER
// ==========================================
export const getAnalyticsReport = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalContacts = await Contact.countDocuments();

    // Chart analytics datasets
    const monthlyRevenue = [
      { month: "Jan", revenue: 4200 },
      { month: "Feb", revenue: 5800 },
      { month: "Mar", revenue: 7100 },
      { month: "Apr", revenue: 6400 },
      { month: "May", revenue: 8900 },
      { month: "Jun", revenue: 10400 },
      { month: "Jul", revenue: 12800 },
    ];

    const userGrowth = [
      { month: "Jan", users: 24 },
      { month: "Feb", users: 48 },
      { month: "Mar", users: 82 },
      { month: "Apr", users: 115 },
      { month: "May", users: 160 },
      { month: "Jun", users: 210 },
      { month: "Jul", users: totalUsers > 0 ? totalUsers : 260 },
    ];

    const bookingDistribution = [
      { category: "Trial Pass", count: Math.round(totalBookings * 0.45) || 18 },
      { category: "Pro Athlete Pass", count: Math.round(totalBookings * 0.35) || 14 },
      { category: "VIP Pass", count: Math.round(totalBookings * 0.20) || 8 },
    ];

    res.json({
      summary: {
        totalUsers,
        totalBookings,
        totalContacts,
        growthRate: "+24.5%",
      },
      charts: {
        monthlyRevenue,
        userGrowth,
        bookingDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate analytics report" });
  }
};
