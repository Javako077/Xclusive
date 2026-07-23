import Contact from "../models/Contact.js";

// @desc    Submit contact form message
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, goal, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email, and message are required" });
      return;
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || "",
      goal: goal || "General Inquiry",
      message
    });

    res.status(201).json({
      message: "Message received successfully",
      contact
    });
  } catch (error) {
    console.error("[SubmitContact Controller Error]", error);
    res.status(500).json({ error: error.message || "Failed to submit contact message" });
  }
};
