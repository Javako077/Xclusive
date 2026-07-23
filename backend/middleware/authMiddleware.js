import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key_here_123456");

      // Get user from the token, exclude password
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(401).json({ error: "Not authorized, user not found" });
        return;
      }

      next();
    } catch (error) {
      console.error("[Auth Middleware Error]", error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token provided" });
  }
};
