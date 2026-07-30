/**
 * Centralized API Client & Service Configuration
 * 
 * Uses `import.meta.env.VITE_API_BASE_URL` from .env for all requests.
 * All API routes pass through the unified `request()` helper.
 */

// Retrieve base URL from environment variables
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const isLocalHost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  if (!isLocalHost && (!envUrl || envUrl.includes("localhost"))) {
    console.warn(
      "[API Client] Warning: Frontend is running on production origin (" +
        (typeof window !== "undefined" ? window.location.origin : "public domain") +
        "), but VITE_API_BASE_URL is pointing to localhost or missing. Update VITE_API_BASE_URL in your hosting provider settings."
    );
  }

  // Remove trailing slashes if present
  return (envUrl || "").replace(/\/+$/, "");
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Generate authorization and content headers
 * @param {'user' | 'admin' | 'none'} authType 
 * @param {object} customHeaders 
 */
const getHeaders = (authType = "user", customHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (authType === "admin") {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      headers["Authorization"] = `Bearer ${adminToken}`;
    }
  } else if (authType === "user") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Centralized HTTP request handler
 * @param {string} endpoint - API path e.g. "/api/auth/login"
 * @param {object} options - Request options (method, body, headers, authType)
 */
async function request(endpoint, options = {}) {
  const { method = "GET", body, headers = {}, authType = "user", ...rest } = options;

  // Build full target URL dynamically using environment variable
  const fullUrl = `${API_BASE_URL}${endpoint}`;

  const fetchOptions = {
    method,
    headers: getHeaders(authType, headers),
    ...rest,
  };

  if (body !== undefined) {
    fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const res = await fetch(fullUrl, fetchOptions);

  let result = null;
  try {
    result = await res.json();
  } catch {
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return null;
  }

  if (!res.ok || (result && result.error)) {
    throw new Error(result?.error || `Request failed with status ${res.status}`);
  }

  return result;
}

export const apiService = {
  // User Auth APIs
  async signup(data) {
    const result = await request("/api/auth/signup", {
      method: "POST",
      body: data,
    });
    if (result?.token) {
      localStorage.setItem("token", result.token);
    }
    return result.user;
  },

  async login(data) {
    const result = await request("/api/auth/login", {
      method: "POST",
      body: data,
    });
    if (result?.token) {
      localStorage.setItem("token", result.token);
    }
    return result.user;
  },

  async getMe() {
    return await request("/api/auth/me", { authType: "user" });
  },

  async sendOtp(data) {
    return await request("/api/auth/send-otp", {
      method: "POST",
      body: data,
    });
  },

  async verifyUserOtp(data) {
    return await request("/api/auth/verify-otp", {
      method: "POST",
      body: data,
    });
  },

  async verifyOtpAndResetPassword(data) {
    return await request("/api/auth/verify-otp-reset", {
      method: "POST",
      body: data,
    });
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    sessionStorage.clear();
  },

  // Dedicated Admin Auth APIs
  async adminLogin(data) {
    const result = await request("/api/admin/auth/login", {
      method: "POST",
      body: data,
      authType: "none",
    });
    if (result?.token) {
      localStorage.setItem("adminToken", result.token);
    }
    return result;
  },

  async adminForgotPassword(data) {
    return await request("/api/admin/auth/forgot-password", {
      method: "POST",
      body: data,
      authType: "none",
    });
  },

  async adminVerifyOtp(data) {
    return await request("/api/admin/auth/verify-otp", {
      method: "POST",
      body: data,
      authType: "none",
    });
  },

  async adminResetPassword(data) {
    return await request("/api/admin/auth/reset-password", {
      method: "POST",
      body: data,
      authType: "none",
    });
  },

  async getAdminProfile() {
    const result = await request("/api/admin/auth/me", { authType: "admin" });
    return result.admin;
  },

  adminLogout() {
    localStorage.removeItem("adminToken");
  },

  // Contact API
  async submitContact(data) {
    return await request("/api/contact", {
      method: "POST",
      body: data,
    });
  },

  // Save Plan API
  async savePlan(data) {
    return await request("/api/user/saved-plans", {
      method: "POST",
      body: data,
    });
  },

  // AI Coach API
  async askAiCoach(data) {
    const result = await request("/api/ai/coach", {
      method: "POST",
      body: data,
    });
    return result.reply;
  },

  // Booking & Concurrency APIs
  async getSlotAvailability(date, userEmail) {
    try {
      let endpoint = `/api/bookings/availability?date=${date || ""}`;
      if (userEmail) {
        endpoint += `&userEmail=${encodeURIComponent(userEmail)}`;
      }
      return await request(endpoint, { authType: "user" });
    } catch {
      return null;
    }
  },

  async createBooking(data) {
    return await request("/api/bookings/book", {
      method: "POST",
      body: data,
    });
  },

  // Admin Portal Dashboard APIs (Protected strictly with adminToken)
  async getAdminStats() {
    return await request("/api/admin/stats", { authType: "admin" });
  },

  async getAdminUsers() {
    return await request("/api/admin/users", { authType: "admin" });
  },

  async updateAdminUserRole(userId, role) {
    return await request(`/api/admin/users/${userId}/role`, {
      method: "PUT",
      body: { role },
      authType: "admin",
    });
  },

  async updateAdminUserPlan(userId, membershipPlan) {
    return await request(`/api/admin/users/${userId}/plan`, {
      method: "PUT",
      body: { membershipPlan },
      authType: "admin",
    });
  },

  async deleteAdminUser(userId) {
    return await request(`/api/admin/users/${userId}`, {
      method: "DELETE",
      authType: "admin",
    });
  },

  async getAdminBookings() {
    return await request("/api/admin/bookings", { authType: "admin" });
  },

  async deleteAdminBooking(bookingId) {
    return await request(`/api/admin/bookings/${bookingId}`, {
      method: "DELETE",
      authType: "admin",
    });
  },

  async toggleBlockAdminUser(userId) {
    return await request(`/api/admin/users/${userId}/block`, {
      method: "PUT",
      authType: "admin",
    });
  },

  async getAdminContacts() {
    return await request("/api/admin/contacts", { authType: "admin" });
  },

  async updateAdminBookingStatus(bookingId, status) {
    return await request(`/api/admin/bookings/${bookingId}/status`, {
      method: "PUT",
      body: { status },
      authType: "admin",
    });
  },

  async fetchAdminContent() {
    return await request("/api/admin/content", { authType: "admin" });
  },

  async createAdminContent(data) {
    return await request("/api/admin/content", {
      method: "POST",
      body: data,
      authType: "admin",
    });
  },

  async deleteAdminContent(id) {
    return await request(`/api/admin/content/${id}`, {
      method: "DELETE",
      authType: "admin",
    });
  },

  async fetchAdminNotifications() {
    return await request("/api/admin/notifications", { authType: "admin" });
  },

  async sendAdminNotification(data) {
    return await request("/api/admin/notifications", {
      method: "POST",
      body: data,
      authType: "admin",
    });
  },

  async deleteAdminNotification(id) {
    return await request(`/api/admin/notifications/${id}`, {
      method: "DELETE",
      authType: "admin",
    });
  },

  async fetchAdminReports() {
    return await request("/api/admin/reports", { authType: "admin" });
  },
};
