import React, { useState } from 'react';
import { X, Flame, Check, Dumbbell, QrCode, ShieldCheck, Sparkles, Printer } from 'lucide-react';

export const FreePassModal = ({ isOpen, onClose }) => {
  const [passCreated, setPassCreated] = useState(false);
  const [passData, setPassData] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    goal: 'Muscle Building & Strength',
    time: 'Morning (6 AM - 11 AM)',
  });

  if (!isOpen) return null;

  const handleGeneratePass = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    const today = new Date();
    const validUntil = new Date(today);
    validUntil.setDate(today.getDate() + 3);

    const pass = {
      id: `APEX-VIP-${Math.floor(100000 + Math.random() * 900000)}`,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      preferredGoal: formData.goal,
      preferredTime: formData.time,
      issueDate: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      validUntil: validUntil.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setPassData(pass);
    setPassCreated(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!passCreated ? (
          <form onSubmit={handleGeneratePass} className="space-y-5">
            <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Instant Pass Generator
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">CLAIM YOUR 3-DAY VIP PASS</h3>
              <p className="text-xs text-slate-400 mt-1">
                Experience full access to Apex Gym, group classes, infrared sauna suites, and a complimentary coach consultation.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Miller"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="marcus@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-lime-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Goal</label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-lime-400"
                  >
                    <option value="Muscle Building">Muscle Building</option>
                    <option value="Fat Loss">Fat Loss & HIIT</option>
                    <option value="Boxing & Power">Boxing Technique</option>
                    <option value="General Fitness">General Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Time</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-lime-400"
                  >
                    <option value="Morning">Morning (6 AM - 11 AM)</option>
                    <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening">Evening (5 PM - 10 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-lime-400 text-slate-950 font-black text-sm uppercase tracking-wider hover:bg-lime-300 shadow-xl shadow-lime-400/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Flame className="w-5 h-5 fill-slate-950" /> Generate Digital VIP Pass
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400/20 text-lime-400 text-xs font-extrabold uppercase mb-2">
                <Check className="w-4 h-4" /> VIP Pass Ready
              </div>
              <h3 className="text-xl font-bold text-white">Show this pass at front desk</h3>
            </div>

            {/* Pass Card Component */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-lime-400 rounded-2xl p-6 relative shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center text-slate-950 font-black">
                    <Dumbbell className="w-4 h-4 -rotate-45" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">APEX GYM</div>
                    <div className="text-[9px] font-bold text-lime-400 uppercase tracking-widest">3-DAY VIP GUEST PASS</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono font-semibold text-slate-400">{passData?.id}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Guest Name</span>
                  <div className="text-lg font-black text-white">{passData?.fullName}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Issue Date</span>
                    <span className="font-semibold text-white">{passData?.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Valid Until</span>
                    <span className="font-semibold text-lime-400">{passData?.validUntil}</span>
                  </div>
                </div>
              </div>

              {/* QR Code Barcode Simulation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <QrCode className="w-10 h-10 text-lime-400" />
                  <div>
                    <div className="text-[11px] font-bold text-white">Scan at Entrance Gate</div>
                    <div className="text-[9px] text-slate-400">Presents full facility access</div>
                  </div>
                </div>
                <ShieldCheck className="w-6 h-6 text-lime-400" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print / Save Pass
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs hover:bg-lime-300 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
