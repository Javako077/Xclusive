import Admin from "../models/Admin.js";

/**
 * Seed initial Admin account if none exists in database
 */
export const seedInitialAdmin = async () => {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      const initialEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@xclusive.com";
      const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@123456";

      const defaultAdmin = new Admin({
        name: "Head Administrator",
        email: initialEmail,
        password: initialPassword, // Hashed automatically by pre-save hook
        role: "superadmin",
      });
      await defaultAdmin.save();
      console.log("[Admin Auth System] Seeded initial admin account.");
    }
  } catch (error) {
    console.error("[Seed Admin Error]", error.message);
  }
};
