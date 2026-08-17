import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userPhone: {
      type: String,
      default: "",
    },
    planId: {
      type: String,
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true, // Amount in INR
    },
    amountPaise: {
      type: Number,
      required: true, // Amount in paise for Razorpay
    },
    currency: {
      type: String,
      default: "INR",
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["created", "captured", "failed", "refunded"],
      default: "created",
    },
    membershipStatus: {
      type: String,
      enum: ["pending", "active", "failed", "cancelled"],
      default: "pending",
    },
    failureReason: {
      type: String,
      default: "",
    },
    slotTime: {
      type: String,
      default: "",
    },
    startDate: {
      type: String,
      default: "",
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false,
    },
    webhookEvents: [
      {
        event: String,
        receivedAt: { type: Date, default: Date.now },
        payload: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
