import React, { useState } from 'react';
import { Check, Flame, Sparkles, Zap, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const CHOOSE_YOUR_PLANS = [
  {
    id: 'plan-monthly',
    name: 'Monthly Plan',
    badge: 'FLEXIBLE',
    tagline: 'Full gym access with zero long-term commitment.',
    priceText: '$100 / month',
    amount: 100,
    term: '1 Month',
    features: [
      'Full Gym Floor & Strength Equipment',
      'Locker Room & Steam Shower Access',
      'Standard Operating Hours (5 AM - 11 PM)',
      'Free Fitness Orientation Session',
      'Xclusive Mobile App Access',
    ],
  },
  {
    id: 'plan-quarterly',
    name: 'Quarterly Plan',
    badge: 'SAVE $50',
    tagline: 'Ideal for 90-day physical transformations.',
    priceText: '$250 / 3 months',
    amount: 250,
    term: '3 Months',
    features: [
      'Everything in Monthly Plan',
      'UNLIMITED Group Fitness & HIIT Classes',
      'Infrared Sauna & Recovery Lounge',
      '1x Monthly 3D InBody Scan',
      '2 Guest Passes Included',
    ],
  },
  {
    id: 'plan-half-yearly',
    name: 'Half Yearly Plan',
    badge: 'POPULAR • SAVE $150',
    tagline: 'Consistent athletic development over 6 months.',
    priceText: '$450 / 6 months',
    amount: 450,
    term: '6 Months',
    popular: true,
    features: [
      'Everything in Quarterly Plan',
      '24/7 Priority Gym Access Keycard',
      '1x Complimentary Personal Training Session',
      'Permanent VIP Private Locker',
      'Monthly Nutrition & Macro Plan',
    ],
  },
  {
    id: 'plan-yearly',
    name: 'Yearly Plan',
    badge: 'BEST VALUE • SAVE $500',
    tagline: 'Complete 365-day lifestyle & physical mastery.',
    priceText: '$700 / year',
    amount: 700,
    term: 'Yearly',
    features: [
      'Everything in Half Yearly Plan',
      '4x Personal Trainer Sessions Per Year',
      'Unlimited Cryo & Hydro Massage',
      'Unlimited Guest Passes (Bring a Friend Anytime)',
      'Complimentary Apparel & Shaker Pack',
    ],
  },
];

export const MembershipCalculator = ({ onJoinPlan, onBookTrial }) => {
  const [selectedPlan, setSelectedPlan] = useState(CHOOSE_YOUR_PLANS[2]); // Default Half Yearly

  return (
    <section id="memberships" className="py-24 bg-black text-white relative border-t border-[#D4AF37]/20 overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-3">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Transparent Rates
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-4 text-white">
            CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16]">PLAN.</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
            Select the membership commitment that fits your lifestyle. Choose between Monthly, Quarterly, Half Yearly, and Yearly plans.
          </p>
        </div>

        {/* 4 Membership Plan Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {CHOOSE_YOUR_PLANS.map((plan) => {
            const isSelected = selectedPlan.id === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between cursor-pointer relative ${
                  isSelected
                    ? 'bg-zinc-950 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20 scale-[1.02]'
                    : 'bg-zinc-950/60 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-black italic uppercase text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-white/50 mb-6">{plan.tagline}</p>

                  <div className="mb-6">
                    <span className="text-4xl sm:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16]">
                      {plan.priceText}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                        <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buttons: Join Now & Book Your Trial Class */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan);
                      if (onJoinPlan) onJoinPlan(plan);
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl"
                  >
                    <Flame className="w-4 h-4 fill-black" /> Join Now <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBookTrial) onBookTrial();
                      else {
                        const el = document.getElementById('trial');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full py-2.5 bg-black border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer rounded-xl"
                  >
                    Book Your Trial Class
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Assurance Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#18150c] to-zinc-950 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <span>Instant Membership Activation • No Hidden Fees • Cancel or Pause Anytime</span>
          </div>
          <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Official Xclusive Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};
