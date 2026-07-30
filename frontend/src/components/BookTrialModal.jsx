import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { apiService } from '../services/api';

const INITIAL_10_SLOTS = [
  // Morning Slots (5:00 AM - 10:00 AM)
  { id: 'm1', time: '05:00 AM - 06:00 AM', period: 'Morning', max: 4, booked: 2 },
  { id: 'm2', time: '06:00 AM - 07:00 AM', period: 'Morning', max: 4, booked: 1 },
  { id: 'm3', time: '07:00 AM - 08:00 AM', period: 'Morning', max: 4, booked: 4 }, // FULL
  { id: 'm4', time: '08:00 AM - 09:00 AM', period: 'Morning', max: 4, booked: 3 },
  { id: 'm5', time: '09:00 AM - 10:00 AM', period: 'Morning', max: 4, booked: 0 },
  // Evening Slots (5:00 PM - 10:00 PM)
  { id: 'e1', time: '05:00 PM - 06:00 PM', period: 'Evening', max: 4, booked: 1 },
  { id: 'e2', time: '06:00 PM - 07:00 PM', period: 'Evening', max: 4, booked: 4 }, // FULL
  { id: 'e3', time: '07:00 PM - 08:00 PM', period: 'Evening', max: 4, booked: 2 },
  { id: 'e4', time: '08:00 PM - 09:00 PM', period: 'Evening', max: 4, booked: 3 },
  { id: 'e5', time: '09:00 PM - 10:00 PM', period: 'Evening', max: 4, booked: 0 },
];

export const BookTrialModal = ({ isOpen, onClose, user }) => {
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('05:00 AM - 06:00 AM');

  // Slot capacity state (Max 4 persons per slot)
  const [slots, setSlots] = useState(INITIAL_10_SLOTS);
  const [userBookedTimes, setUserBookedTimes] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch real-time availability dynamically
  useEffect(() => {
    let active = true;
    if (isOpen) {
      const fetchSlots = async () => {
        const activeEmail = email || user?.email;
        const data = await apiService.getSlotAvailability(preferredDate, activeEmail);
        if (data && data.slots && active) {
          setSlots(data.slots);
        }
      };
      fetchSlots();
    }
    return () => {
      active = false;
    };
  }, [isOpen, preferredDate, email, user?.email]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preferredTime) return;

    setLoading(true);
    try {
      // Backend Double Check At Booking Instant
      const res = await apiService.createBooking({
        fullName,
        email: email || user?.email,
        phone,
        date: preferredDate || new Date().toISOString().split('T')[0],
        slotTime: preferredTime,
        bookingType: 'trial',
        planName: 'Trial Pass (₹2,000)',
      });

      setUserBookedTimes((prev) => new Set(prev).add(preferredTime));

      if (res.slotStatus) {
        setSlots((prev) =>
          prev.map((s) =>
            s.time === preferredTime
              ? {
                  ...s,
                  booked: res.slotStatus.booked,
                  isUserBooked: true,
                  isBooked: true,
                }
              : s
          )
        );
      }
      setSubmitted(true);
    } catch (err) {
      alert(err.message || 'Slot overbooking prevented by backend concurrency check.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setPreferredDate('');
    setPreferredTime('05:00 AM - 06:00 AM');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
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
                5 Morning (5 AM - 10 AM) & 5 Evening (5 PM - 10 PM) Slots • Max 4 Persons / Slot
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

              {/* SELECT TIME SLOT (5 Morning + 5 Evening Slots) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Preferred Time Slot (Max 4 Persons / Slot) <span className="text-[#D4AF37]">*</span>
                </label>

                {/* Morning Slots Header */}
                <div className="text-[10px] font-black uppercase tracking-widest text-[#F5D76E] mb-1.5 flex items-center gap-1">
                  <span>☀️ Morning Batches (5:00 AM - 10:00 AM)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {slots
                    .filter((s) => s.period === 'Morning')
                    .map((s) => {
                      const isSlotBooked = Boolean(s.isBooked || s.isUserBooked || s.booked >= s.max || userBookedTimes.has(s.time));
                      const availableSpots = Math.max(0, s.max - (s.booked || 0));
                      const isSelected = preferredTime === s.time && !isSlotBooked;

                      return (
                        <button
                          type="button"
                          key={s.id}
                          disabled={isSlotBooked}
                          onClick={() => setPreferredTime(s.time)}
                          className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                            isSlotBooked
                              ? 'bg-red-950/20 border-red-500/30 text-red-400 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black border-[#F5D76E] font-bold shadow cursor-pointer'
                              : 'bg-black border-white/10 text-white/80 hover:border-white/30 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase">{s.time}</span>
                            {isSlotBooked ? (
                              <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                                BOOKED
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
                          <div className="text-[9px] opacity-75 mt-0.5">
                            {isSlotBooked ? 'Booked' : `${s.booked || 0}/4 Booked`}
                          </div>
                        </button>
                      );
                    })}
                </div>

                {/* Evening Slots Header */}
                <div className="text-[10px] font-black uppercase tracking-widest text-[#F5D76E] mb-1.5 flex items-center gap-1">
                  <span>🌙 Evening Batches (5:00 PM - 10:00 PM)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {slots
                    .filter((s) => s.period === 'Evening')
                    .map((s) => {
                      const isSlotBooked = Boolean(s.isBooked || s.isUserBooked || s.booked >= s.max || userBookedTimes.has(s.time));
                      const availableSpots = Math.max(0, s.max - (s.booked || 0));
                      const isSelected = preferredTime === s.time && !isSlotBooked;

                      return (
                        <button
                          type="button"
                          key={s.id}
                          disabled={isSlotBooked}
                          onClick={() => setPreferredTime(s.time)}
                          className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                            isSlotBooked
                              ? 'bg-red-950/20 border-red-500/30 text-red-400 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black border-[#F5D76E] font-bold shadow cursor-pointer'
                              : 'bg-black border-white/10 text-white/80 hover:border-white/30 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase">{s.time}</span>
                            {isSlotBooked ? (
                              <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                                BOOKED
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
                          <div className="text-[9px] opacity-75 mt-0.5">
                            {isSlotBooked ? 'Booked' : `${s.booked || 0}/4 Booked`}
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
