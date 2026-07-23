import express from "express";
import { askAiCoach } from "../controllers/aiController.js";

const router = express.Router();

router.post("/coach", askAiCoach);

export default router;
