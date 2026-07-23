import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    default: ""
  },
  goal: {
    type: String,
    default: "General Inquiry"
  },
  message: {
    type: String,
    required: [true, "Message is required"]
  }
}, {
  timestamps: true
});

const Contact = mongoose.model("Contact", ContactSchema);
export default Contact;
