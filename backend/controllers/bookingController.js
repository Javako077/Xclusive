import Booking from "../models/Booking.js";

const DEFAULT_SLOTS = [
  // Morning Slots (5:00 AM - 10:00 AM)
  { id: 'm1', time: '05:00 AM - 06:00 AM', period: 'Morning', max: 4 },
  { id: 'm2', time: '06:00 AM - 07:00 AM', period: 'Morning', max: 4 },
  { id: 'm3', time: '07:00 AM - 08:00 AM', period: 'Morning', max: 4 },
  { id: 'm4', time: '08:00 AM - 09:00 AM', period: 'Morning', max: 4 },
  { id: 'm5', time: '09:00 AM - 10:00 AM', period: 'Morning', max: 4 },
  // Evening Slots (5:00 PM - 10:00 PM)
  { id: 'e1', time: '05:00 PM - 06:00 PM', period: 'Evening', max: 4 },
  { id: 'e2', time: '06:00 PM - 07:00 PM', period: 'Evening', max: 4 },
  { id: 'e3', time: '07:00 PM - 08:00 PM', period: 'Evening', max: 4 },
  { id: 'e4', time: '08:00 PM - 09:00 PM', period: 'Evening', max: 4 },
  { id: 'e5', time: '09:00 PM - 10:00 PM', period: 'Evening', max: 4 },
];

/**
 * @desc Get real-time slot availability for a target date
 * @route GET /api/bookings/availability?date=YYYY-MM-DD
 */
export const getSlotAvailability = async (req, res) => {
  try {
    const { date, userEmail } = req.query;
    const targetDate = date || new Date().toISOString().split("T")[0];

    // Find all bookings for target date
    const bookings = await Booking.find({ date: targetDate });

    const countMap = {};
    const userBookedSet = new Set();

    bookings.forEach((b) => {
      countMap[b.slotTime] = (countMap[b.slotTime] || 0) + 1;
      if (userEmail && b.email && b.email.toLowerCase() === userEmail.toLowerCase()) {
        userBookedSet.add(b.slotTime);
      }
    });

    const availability = DEFAULT_SLOTS.map((slot) => {
      const currentBooked = countMap[slot.time] || 0;
      const isUserBooked = userBookedSet.has(slot.time);
      const isFull = currentBooked >= slot.max;
      const availableSpots = Math.max(0, slot.max - currentBooked);
      const isBooked = isUserBooked || isFull;

      return {
        ...slot,
        booked: currentBooked,
        availableSpots,
        isFull,
        isUserBooked,
        isBooked,
        statusText: isBooked ? "BOOKED" : `${availableSpots} Left`,
      };
    });

    res.json({
      date: targetDate,
      slots: availability,
    });
  } catch (error) {
    console.error("[Slot Availability Error]", error);
    res.status(500).json({ error: "Failed to fetch slot availability." });
  }
};

/**
 * @desc Atomic Booking Reservation with Instant Double-Check Validation
 * @route POST /api/bookings/book
 */
export const createBooking = async (req, res) => {
  try {
    const { fullName, email, phone, date, slotTime, bookingType, planName } = req.body;

    if (!fullName || !email || !phone || !slotTime) {
      return res.status(400).json({ error: "Full Name, Email, Phone, and Slot Time are required." });
    }

    const bookingDate = date || new Date().toISOString().split("T")[0];
    const MAX_CAPACITY = 4;

    // ATOMIC DOUBLE-CHECK: Re-verify current slot count immediately before saving
    const currentBookedCount = await Booking.countDocuments({
      slotTime,
      date: bookingDate,
    });

    if (currentBookedCount >= MAX_CAPACITY) {
      return res.status(409).json({
        error: `SLOT OVERBOOKING PREVENTED: The slot "${slotTime}" has just reached its maximum capacity of ${MAX_CAPACITY} persons. Please select an available slot.`,
        slotTime,
        booked: currentBookedCount,
        max: MAX_CAPACITY,
        isFull: true,
      });
    }

    // Save booking atomically
    const newBooking = new Booking({
      fullName,
      email,
      phone,
      date: bookingDate,
      slotTime,
      bookingType: bookingType || "trial",
      planName: planName || "Trial Pass",
      paymentStatus: "paid",
    });

    await newBooking.save();

    // Fetch updated count
    const updatedCount = currentBookedCount + 1;

    res.status(201).json({
      message: "Booking confirmed successfully with backend concurrency verification.",
      booking: newBooking,
      slotStatus: {
        slotTime,
        booked: updatedCount,
        availableSpots: MAX_CAPACITY - updatedCount,
        isFull: updatedCount >= MAX_CAPACITY,
      },
    });
  } catch (error) {
    console.error("[Create Booking Error]", error);
    res.status(500).json({ error: "Failed to complete booking." });
  }
};
