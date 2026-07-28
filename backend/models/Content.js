import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["announcement", "banner", "class", "facility"],
      default: "announcement",
    },
    body: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    author: {
      type: String,
      default: "Admin Team",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Content", contentSchema);
