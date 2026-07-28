import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    targetAudience: {
      type: String,
      enum: ["all", "user", "staff"],
      default: "all",
    },
    type: {
      type: String,
      enum: ["info", "alert", "promotion"],
      default: "info",
    },
    sentBy: {
      type: String,
      default: "System Administrator",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", notificationSchema);
