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
  }
};
