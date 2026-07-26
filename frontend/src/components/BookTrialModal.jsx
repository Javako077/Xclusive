import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, CreditCard, AlertCircle } from 'lucide-react';

const INITIAL_SLOTS = [
  { time: '07:00 AM', max: 4, booked: 2 },
  { time: '09:00 AM', max: 4, booked: 4 }, // FULL
  { time: '11:00 AM', max: 4, booked: 1 },
  { time: '02:00 PM', max: 4, booked: 3 },
  { time: '05:00 PM', max: 4, booked: 4 }, // FULL
  { time: '07:00 PM', max: 4, booked: 0 },
];

export const BookTrialModal = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('07:00 AM');

  // Slot capacity state (Max 4 persons per slot)
  const [slots, setSlots] = useState(INITIAL_SLOTS);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!preferredTime) return;

    // Check if slot is full
    const targetSlot = slots.find((s) => s.time === preferredTime);
    if (targetSlot && targetSlot.booked >= targetSlot.max) {
      alert('This slot is currently FULL (4/4 persons booked). Please select an available slot.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Increment booked count for the selected slot
      setSlots((prev) =>
        prev.map((s) => (s.time === preferredTime ? { ...s, booked: s.booked + 1 } : s))
      );
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setPreferredDate('');
    setPreferredTime('07:00 AM');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F5D76E] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black italic uppercase text-white">TRIAL RESERVATION CONFIRMED!</h3>
            <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-[#F5D76E] font-bold">{fullName}</span>! Your ₹2,000 trial pass has been reserved for <span className="text-[#F5D76E] font-bold">{preferredDate || 'your selected date'} at {preferredTime}</span>.
            </p>
            <div className="p-4 rounded-2xl bg-black border border-white/10 text-xs text-left space-y-1.5 max-w-md mx-auto text-white/60">
              <div><strong className="text-white">Email:</strong> {email}</div>
              <div><strong className="text-white">Phone:</strong> {phone}</div>
              <div><strong className="text-white">Trial Fee Paid:</strong> ₹2,000 (100% Redeemable)</div>
              <div><strong className="text-white">Scheduled Time:</strong> {preferredDate} at {preferredTime}</div>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-block mb-2">
                <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> VIP Guest Experience
                </span>
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tight text-white">
                BOOK YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16]">TRIAL</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Max 4 Persons Per Slot • Real-Time Slot Capacity
              </p>
            </div>

            {/* Redeemable Fee Notice Banner */}
            <div className="mb-5 p-3.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#F5D76E] shrink-0 mt-0.5" />
              <p className="text-xs text-[#F5D76E] leading-relaxed">
                <span className="font-bold">100% Redeemable Fee:</span> Your <span className="font-black">₹2,000</span> trial fee is fully redeemable against any membership plan you join.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Full Name <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Email & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Email <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Phone Number <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Preferred Date <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  />
                </div>
              </div>

              {/* Preferred Time Slots (4 Persons Max Per Slot) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Preferred Time Slot (Max 4 Persons / Slot) <span className="text-[#D4AF37]">*</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {slots.map((s) => {
                    const isFull = s.booked >= s.max;
                    const availableSpots = s.max - s.booked;
                    const isSelected = preferredTime === s.time && !isFull;

                    return (
                      <button
                        type="button"
                        key={s.time}
                        disabled={isFull}
                        onClick={() => setPreferredTime(s.time)}
                        className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                          isFull
                            ? 'bg-red-950/20 border-red-500/30 text-red-400 opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black border-[#F5D76E] font-bold shadow-lg cursor-pointer'
                            : 'bg-black border-white/10 text-white/80 hover:border-white/30 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider">{s.time}</span>
                          {isFull ? (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                              FULL
                            </span>
                          ) : (
                            <span
                              className={`text-[9px] font-bold ${
                                isSelected ? 'text-black/80' : 'text-[#D4AF37]'
                              }`}
                            >
                              {availableSpots} Left
                            </span>
                          )}
                        </div>

                        <div className="mt-1 text-[10px] opacity-75">
                          {isFull ? '4/4 Persons Booked' : `${s.booked}/4 Persons Booked`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
              >
                <CreditCard className="w-4 h-4" />
                {loading ? 'Processing Payment...' : 'Pay ₹2,000 & Book Trial'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
