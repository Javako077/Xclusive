const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  // Auth APIs
  async signup(data) {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Signup failed");
    }
    if (result.token) {
      localStorage.setItem("token", result.token);
    }
    return result.user;
  },

  async login(data) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Login failed");
    }
    if (result.token) {
      localStorage.setItem("token", result.token);
    }
    return result.user;
  },

  async sendOtp(data) {
    const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Failed to send OTP code.");
    }
    return result;
  },

  async verifyOtpAndResetPassword(data) {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp-reset`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Failed to verify OTP code & reset password.");
    }
    return result;
  },

  // Contact API
  async submitContact(data) {
    const res = await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Failed to submit contact message");
    }
    return result;
  },

  // Save Plan API
  async savePlan(data) {
    const res = await fetch(`${API_BASE_URL}/api/user/saved-plans`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Failed to save workout plan");
    }
    return result;
  },

  // AI Coach API
  async askAiCoach(data) {
    const res = await fetch(`${API_BASE_URL}/api/ai/coach`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "AI Coach query failed");
    }
    return result.reply;
  },

  // Booking & Concurrency APIs
  async getSlotAvailability(date) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/availability?date=${date || ''}`, {
        headers: getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async createBooking(data) {
    const res = await fetch(`${API_BASE_URL}/api/bookings/book`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Booking failed due to overbooking protection.");
    }
    return result;
  },

  // Logout utility
  logout() {
    localStorage.removeItem("token");
  },

  // Admin APIs
  async getAdminStats() {
    const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to load admin stats");
    return result;
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to load users");
    return result;
  },

  async updateAdminUserRole(userId, role) {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to update role");
    return result;
  },

  async updateAdminUserPlan(userId, membershipPlan) {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/plan`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ membershipPlan }),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to update user plan");
    return result;
  },

  async deleteAdminUser(userId) {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to delete user");
    return result;
  },

  async getAdminBookings() {
    const res = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to load bookings");
    return result;
  },

  async deleteAdminBooking(bookingId) {
    const res = await fetch(`${API_BASE_URL}/api/admin/bookings/${bookingId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to delete booking");
    return result;
  },

  async toggleBlockAdminUser(userId) {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/block`, {
      method: "PUT",
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to update block status");
    return result;
  },

  async getAdminContacts() {
    const res = await fetch(`${API_BASE_URL}/api/admin/contacts`, {
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to load contacts");
    return result;
  },

  async updateAdminBookingStatus(bookingId, status) {
    const res = await fetch(`${API_BASE_URL}/api/admin/bookings/${bookingId}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to update booking status");
    return result;
  },

  async fetchAdminContent() {
    const res = await fetch(`${API_BASE_URL}/api/admin/content`, {
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to fetch content");
    return result;
  },

  async createAdminContent(data) {
    const res = await fetch(`${API_BASE_URL}/api/admin/content`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to create content");
    return result;
  },

  async deleteAdminContent(id) {
    const res = await fetch(`${API_BASE_URL}/api/admin/content/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to delete content");
    return result;
  },

  async fetchAdminNotifications() {
    const res = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to fetch notifications");
    return result;
  },

  async sendAdminNotification(data) {
    const res = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to broadcast notification");
    return result;
  },

  async deleteAdminNotification(id) {
    const res = await fetch(`${API_BASE_URL}/api/admin/notifications/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to delete notification");
    return result;
  },

  async fetchAdminReports() {
    const res = await fetch(`${API_BASE_URL}/api/admin/reports`, {
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to fetch analytics report");
    return result;
  }
};
