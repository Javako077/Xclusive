/**
 * Canonical Membership Plans Source of Truth
 * Keeps plan pricing and details unified across backend and frontend.
 */

export const MEMBERSHIP_PLANS = [
  {
    id: "plan-monthly",
    name: "Monthly Plan",
    badge: "FLEXIBLE",
    tagline: "Full gym access with zero long-term commitment.",
    priceText: "₹10,000 / month",
    amount: 10000, // Amount in INR
    term: "1 Month",
    features: [
      "Full Gym Floor & Strength Equipment",
      "Locker Room & Steam Shower Access",
      "Standard Operating Hours (5 AM - 11 PM)",
      "Free Fitness Orientation Session",
      "Xclusive Mobile App Access",
    ],
  },
  {
    id: "plan-quarterly",
    name: "Quarterly Plan",
    badge: "SAVE ₹3,000",
    tagline: "Ideal for 90-day physical transformations.",
    priceText: "₹27,000 / 3 months",
    amount: 27000, // Amount in INR
    term: "3 Months",
    features: [
      "Everything in Monthly Plan",
      "UNLIMITED Group Fitness & HIIT Classes",
      "Infrared Sauna & Recovery Lounge",
      "1x Monthly 3D InBody Scan",
      "2 Guest Passes Included",
    ],
  },
  {
    id: "plan-half-yearly",
    name: "Half Yearly Plan",
    badge: "POPULAR • SAVE ₹5,000",
    tagline: "Consistent athletic development over 6 months.",
    priceText: "₹55,000 / 6 months",
    amount: 55000, // Amount in INR
    term: "6 Months",
    popular: true,
    features: [
      "Everything in Quarterly Plan",
      "24/7 Priority Gym Access Keycard",
      "1x Complimentary Personal Training Session",
      "Permanent VIP Private Locker",
      "Monthly Nutrition & Macro Plan",
    ],
  },
  {
    id: "plan-yearly",
    name: "Yearly Plan",
    badge: "BEST VALUE • SAVE ₹10,000",
    tagline: "Complete 365-day lifestyle & physical mastery.",
    priceText: "₹1,10,000 / year",
    amount: 110000, // Amount in INR
    term: "1 Year",
    features: [
      "Everything in Half Yearly Plan",
      "4x Personal Trainer Sessions Per Year",
      "Unlimited Cryo & Hydro Massage",
      "Unlimited Guest Passes (Bring a Friend Anytime)",
      "Complimentary Apparel & Shaker Pack",
    ],
  },
];

/**
 * Helper function to look up a plan by ID or Name
 */
export const getPlanByIdOrName = (identifier) => {
  if (!identifier) return null;
  const cleanId = String(identifier).trim().toLowerCase();
  return (
    MEMBERSHIP_PLANS.find(
      (p) =>
        p.id.toLowerCase() === cleanId ||
        p.name.toLowerCase() === cleanId ||
        p.name.toLowerCase().replace(/\s+/g, "-") === cleanId
    ) || null
  );
};
