import express from "express";
import { savePlan, deletePlan } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public/Optional auth for saving plan to match current frontend fetch signature
router.post("/saved-plans", savePlan);

// Protected delete plan route
router.delete("/saved-plans/:planId", protect, deletePlan);

export default router;
