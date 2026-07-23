import User from "../models/User.js";

// @desc    Save a workout plan for the user
// @route   POST /api/user/saved-plans
// @access  Public or Private (supports both for compatibility)
export const savePlan = async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    // Use JWT user id if available, otherwise fallback to request body userId
    const id = req.user ? req.user._id : userId;

    if (!id || !title || !content) {
      res.status(400).json({ error: "UserId, title, and content are required" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const plan = {
      title,
      content,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    user.savedPlans = [plan, ...(user.savedPlans || [])];
    await user.save();

    // The newly created plan is at index 0
    const savedPlan = user.savedPlans[0];

    res.json({ message: "Plan saved successfully", plan: savedPlan });
  } catch (error) {
    console.error("[SavePlan Controller Error]", error);
    res.status(500).json({ error: error.message || "Failed to save workout plan" });
  }
};

// @desc    Delete a workout plan for the user
// @route   DELETE /api/user/saved-plans/:planId
// @access  Private
export const deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.savedPlans = user.savedPlans.filter((p) => p.id !== planId && p._id.toString() !== planId);
    await user.save();

    res.json({ message: "Plan deleted successfully", savedPlans: user.savedPlans });
  } catch (error) {
    console.error("[DeletePlan Controller Error]", error);
    res.status(500).json({ error: error.message || "Failed to delete workout plan" });
  }
};
