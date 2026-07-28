import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    slotTime: {
      type: String,
      required: true,
    },
    bookingType: {
      type: String,
      enum: ["trial", "membership"],
      default: "trial",
    },
    planName: {
      type: String,
      default: "Trial Pass",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending"],
      default: "paid",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "approved",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast concurrency checks on slotTime + date
bookingSchema.index({ slotTime: 1, date: 1 });

export default mongoose.model("Booking", bookingSchema);
