import express from "express";
import { getSlotAvailability, createBooking } from "../controllers/bookingController.js";

const router = express.Router();

// GET real-time slot availability
router.get("/availability", getSlotAvailability);

// POST atomic booking creation with race-condition double checking
router.post("/book", createBooking);

export default router;
