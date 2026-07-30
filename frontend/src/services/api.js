const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const isLocalHost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  if (!isLocalHost && (!envUrl || envUrl.includes("localhost"))) {
    console.error(
      "[Xclusive API Warning] The frontend is deployed at " + window.location.origin + 
      " but API_BASE_URL is pointing to localhost. Browsers block public HTTPS origins from accessing local loopback addresses." +
      " Please set VITE_API_BASE_URL in your Vercel Project Settings to your deployed backend URL."
    );
  }

  return envUrl || "http://localhost:3000";
};

const API_BASE_URL = getApiBaseUrl();

const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const getAdminHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    headers["Authorization"] = `Bearer ${adminToken}`;
  }
  return headers;
};

export const apiService = {
  // User Auth APIs (Completely separate from Admin Auth)
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

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Failed to load user profile");
    }
    return result;
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

  async verifyUserOtp(data) {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Invalid or expired OTP code.");
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

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    sessionStorage.clear();
  },

  // Dedicated Admin Auth APIs (Uses adminToken & /api/admin/auth/*)
  async adminLogin(data) {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Admin authentication failed.");
    }
    if (result.token) {
      localStorage.setItem("adminToken", result.token);
    }
    return result;
  },

  async adminForgotPassword(data) {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Failed to request admin password reset.");
    }
    return result;
  },

  async adminVerifyOtp(data) {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Invalid or expired Admin OTP code.");
    }
    return result;
  },

  async adminResetPassword(data) {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Failed to reset admin password.");
    }
    return result;
  },

  async getAdminProfile() {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/me`, {
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || "Failed to load admin profile.");
    }
    return result.admin;
  },

  adminLogout() {
    localStorage.removeItem("adminToken");
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
  async getSlotAvailability(date, userEmail) {
    try {
      let url = `${API_BASE_URL}/api/bookings/availability?date=${date || ''}`;
      if (userEmail) {
        url += `&userEmail=${encodeURIComponent(userEmail)}`;
      }
      const res = await fetch(url, {
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

  // Admin Portal Dashboard APIs (Protected strictly with adminToken)
  async getAdminStats() {
    const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to load admin stats");
    return result;
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to load users");
    return result;
  },

  async updateAdminUserRole(userId, role) {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers: getAdminHeaders(),
      body: JSON.stringify({ role }),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to update role");
    return result;
  },

  async updateAdminUserPlan(userId, membershipPlan) {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/plan`, {
      method: "PUT",
      headers: getAdminHeaders(),
      body: JSON.stringify({ membershipPlan }),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to update user plan");
    return result;
  },

  async deleteAdminUser(userId) {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to delete user");
    return result;
  },

  async getAdminBookings() {
    const res = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to load bookings");
    return result;
  },

  async deleteAdminBooking(bookingId) {
    const res = await fetch(`${API_BASE_URL}/api/admin/bookings/${bookingId}`, {
      method: "DELETE",
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to delete booking");
    return result;
  },

  async toggleBlockAdminUser(userId) {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/block`, {
      method: "PUT",
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to update block status");
    return result;
  },

  async getAdminContacts() {
    const res = await fetch(`${API_BASE_URL}/api/admin/contacts`, {
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to load contacts");
    return result;
  },

  async updateAdminBookingStatus(bookingId, status) {
    const res = await fetch(`${API_BASE_URL}/api/admin/bookings/${bookingId}/status`, {
      method: "PUT",
      headers: getAdminHeaders(),
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to update booking status");
    return result;
  },

  async fetchAdminContent() {
    const res = await fetch(`${API_BASE_URL}/api/admin/content`, {
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to fetch content");
    return result;
  },

  async createAdminContent(data) {
    const res = await fetch(`${API_BASE_URL}/api/admin/content`, {
      method: "POST",
      headers: getAdminHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to create content");
    return result;
  },

  async deleteAdminContent(id) {
    const res = await fetch(`${API_BASE_URL}/api/admin/content/${id}`, {
      method: "DELETE",
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to delete content");
    return result;
  },

  async fetchAdminNotifications() {
    const res = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to fetch notifications");
    return result;
  },

  async sendAdminNotification(data) {
    const res = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
      method: "POST",
      headers: getAdminHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to broadcast notification");
    return result;
  },

  async deleteAdminNotification(id) {
    const res = await fetch(`${API_BASE_URL}/api/admin/notifications/${id}`, {
      method: "DELETE",
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to delete notification");
    return result;
  },

  async fetchAdminReports() {
    const res = await fetch(`${API_BASE_URL}/api/admin/reports`, {
      headers: getAdminHeaders(),
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Failed to fetch analytics report");
    return result;
  }
};
