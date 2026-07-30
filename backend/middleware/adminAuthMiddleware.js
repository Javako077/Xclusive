import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/**
 * Protect middleware strictly for Admin routes.
 * Rejects standard user tokens and non-admin tokens.
 */
export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify JWT token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret_key_here_123456"
      );

      // Verify payload is designated for admin account
      if (decoded.tokenType && decoded.tokenType !== "admin") {
        return res
          .status(403)
          .json({ error: "Access denied. Invalid token type for admin operations." });
      }

      // Fetch admin from Admin collection (NOT User collection)
      const adminDoc = await Admin.findById(decoded.id).select("-password");

      if (!adminDoc) {
        return res
          .status(401)
          .json({ error: "Not authorized. Admin record not found." });
      }

      req.admin = adminDoc;
      // Provide req.user compatibility for shared logic where needed
      req.user = {
        _id: adminDoc._id,
        id: adminDoc._id,
        name: adminDoc.name,
        email: adminDoc.email,
        role: adminDoc.role,
        isAdminAccount: true,
      };

      next();
    } catch (error) {
      console.error("[Admin Auth Middleware Error]", error.message);
      return res.status(401).json({ error: "Not authorized as Admin. Token invalid or expired." });
    }
  } else {
    return res.status(401).json({ error: "Not authorized. Admin access token required." });
  }
};
