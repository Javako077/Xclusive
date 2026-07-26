import React, { useState } from 'react';
import { MEMBERSHIP_PLANS } from '../data/gymData';
import { Check, Flame, Sparkles, Zap, ArrowRight } from 'lucide-react';

export const MembershipCalculator = ({ onOpenAuth }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(MEMBERSHIP_PLANS[1]);

  // Add-ons state
  const [hydroAddon, setHydroAddon] = useState(false);
  const [saunaAddon, setSaunaAddon] = useState(false);
  const [dietAddon, setDietAddon] = useState(false);

  // Price calculations
  const basePrice = isAnnual ? selectedPlan.priceAnnual : selectedPlan.priceMonthly;
  let addonsTotal = 0;
  if (hydroAddon) addonsTotal += 35;
  if (saunaAddon) addonsTotal += 20;
  if (dietAddon) addonsTotal += 25;

  const finalMonthlyPrice = basePrice + addonsTotal;

  return (
    <section id="memberships" className="py-24 bg-black text-white relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block mb-3">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Transparent Pricing
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-4">
            CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059]">PASS.</span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg font-light">
            No long-term contracts. Pause or cancel anytime. Tailor your package with custom recovery add-ons.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <span className={`text-xs font-bold uppercase tracking-wider ${!isAnnual ? 'text-white' : 'text-white/40'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-16 h-8 rounded-full bg-zinc-950 border border-white/10 p-1 relative transition-colors cursor-pointer"
          >
            <div
              className={`w-6 h-6 rounded-full bg-[#D4AF37] transition-transform duration-300 ${
                isAnnual ? 'translate-x-8' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${isAnnual ? 'text-white' : 'text-white/40'}`}>
              Annual Billing
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37] text-[9px] font-black uppercase tracking-widest">
              SAVE 20%
            </span>
          </div>
        </div>

        {/* Membership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isSelected = selectedPlan.id === plan.id;
            const displayPrice = isAnnual ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between cursor-pointer relative ${
                  isSelected
                    ? 'bg-zinc-950 border-[#D4AF37] shadow-2xl scale-[1.03]'
                    : 'bg-zinc-950/40 border-white/5 hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-black italic uppercase text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-white/50 mb-6">{plan.tagline}</p>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black italic text-[#D4AF37]">${displayPrice}</span>
                    <span className="text-xs text-white/40 font-bold uppercase tracking-wider">/ month</span>
                    {isAnnual && <span className="text-[9px] text-white/30 uppercase block ml-2">(billed annually)</span>}
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

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan);
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className={`w-full py-3.5 font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059] text-black hover:opacity-90 shadow-xl shadow-[#D4AF37]/10'
                      : 'bg-black text-white border border-white/10 hover:bg-white/10'
                  }`}
                >
                  Select {plan.name}
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom Package Customizer */}
        <div className="max-w-4xl mx-auto bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4" /> Custom Membership Builder
          </div>
          <h3 className="text-2xl font-black italic uppercase text-white mb-6">Customize Add-Ons for {selectedPlan.name}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <label
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                hydroAddon ? 'bg-white/10 border-[#D4AF37]' : 'bg-black border-white/10'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">Hydro Massage Suite</div>
                <div className="text-[11px] text-white/40">+$35 / mo</div>
              </div>
              <input
                type="checkbox"
                checked={hydroAddon}
                onChange={(e) => setHydroAddon(e.target.checked)}
                className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
              />
            </label>

            <label
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                saunaAddon ? 'bg-white/10 border-[#D4AF37]' : 'bg-black border-white/10'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">Infrared Sauna Suite</div>
                <div className="text-[11px] text-white/40">+$20 / mo</div>
              </div>
              <input
                type="checkbox"
                checked={saunaAddon}
                onChange={(e) => setSaunaAddon(e.target.checked)}
                className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
              />
            </label>

            <label
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                dietAddon ? 'bg-white/10 border-[#D4AF37]' : 'bg-black border-white/10'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">Custom Diet Plan</div>
                <div className="text-[11px] text-white/40">+$25 / mo</div>
              </div>
              <input
                type="checkbox"
                checked={dietAddon}
                onChange={(e) => setDietAddon(e.target.checked)}
                className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* Running Total & Action */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Estimated Monthly Total</span>
              <div className="text-3xl font-black italic text-[#D4AF37] mt-1">
                ${finalMonthlyPrice} <span className="text-xs font-normal text-white/40">/ MONTH</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onOpenAuth) onOpenAuth();
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 shadow-xl shadow-[#D4AF37]/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-black" /> Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

