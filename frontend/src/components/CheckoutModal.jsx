import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, User, Mail, Phone, Lock, Sparkles, ArrowRight, ArrowLeft, Clock, Calendar, Zap, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { loadRazorpayScript } from '../utils/razorpay';
import { toast } from 'react-toastify';

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

export const CheckoutModal = ({ isOpen, onClose, selectedPlan, user }) => {
  const [step, setStep] = useState(1); // 1: User Details & Slot, 2: Payment, 3: Confirmation

  // User Details State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [startDate, setStartDate] = useState('');
  const [selectedSlotTime, setSelectedSlotTime] = useState('05:00 AM - 06:00 AM');
  const [slots, setSlots] = useState(INITIAL_10_SLOTS);
  const [userBookedTimes, setUserBookedTimes] = useState(new Set());

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // default razorpay
  const [loading, setLoading] = useState(false);
  const [confirmationId, setConfirmationId] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);

  // Card form state fallback
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Pre-fill user data if prop updates
  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Fetch real-time slot availability
  useEffect(() => {
    let active = true;
    if (isOpen) {
      const fetchSlots = async () => {
        const activeEmail = email || user?.email;
        const data = await apiService.getSlotAvailability(startDate, activeEmail);
        if (data && data.slots && active) {
          setSlots(data.slots);
        }
      };
      fetchSlots();
    }
    return () => {
      active = false;
    };
  }, [isOpen, startDate, email, user?.email]);

  if (!isOpen || !selectedPlan) return null;

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!fullName || (!email && !user?.email) || !selectedSlotTime) {
      toast.warning('Please fill in all required fields.');
      return;
    }

    // Verify slot availability
    const targetSlot = slots.find((s) => s.time === selectedSlotTime);
    if (targetSlot && (targetSlot.booked >= targetSlot.max || targetSlot.isBooked)) {
      toast.warning('This workout slot is currently BOOKED / FULL. Please select an available slot.');
      return;
    }

    setStep(2);
  };

  /**
   * Primary Razorpay Checkout Integration Function
   */
  const handleRazorpayPayment = async () => {
    setLoading(true);

    try {
      // 1. Call Backend to Create Order (pulls plan price dynamically)
      const orderRes = await apiService.createPaymentOrder({
        planId: selectedPlan.id,
        fullName: fullName || user?.name,
        email: email || user?.email,
        phone,
        slotTime: selectedSlotTime,
        startDate: startDate || new Date().toISOString().split('T')[0],
      });

      if (!orderRes || !orderRes.orderId) {
        throw new Error(orderRes?.error || 'Failed to create payment order on backend.');
      }

      // 2. Dynamically load Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Key ID from backend order response or frontend env
      const razorpayKeyId = orderRes.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_XclusiveGymTestKey';

      // 3. Configure Razorpay Options
      const options = {
        key: razorpayKeyId,
        amount: orderRes.amount, // in paise
        currency: orderRes.currency || 'INR',
        name: 'XCLUSIVE ATHLETIC CLUB',
        description: `${selectedPlan.name} Membership`,
        order_id: orderRes.orderId,
        prefill: {
          name: fullName || user?.name || '',
          email: email || user?.email || '',
          contact: phone || user?.phone || '',
        },
        notes: {
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          slotTime: selectedSlotTime,
        },
        theme: {
          color: '#D4AF37', // Gold matching site design system
          backdrop_color: '#000000',
        },
        handler: async function (response) {
          // Razorpay returns razorpay_payment_id, razorpay_order_id, razorpay_signature
          try {
            setLoading(true);
            const verifyRes = await apiService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              fullName,
              email: email || user?.email,
              phone,
              slotTime: selectedSlotTime,
              startDate,
            });

            if (verifyRes && verifyRes.success) {
              setPaymentResult({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                planName: selectedPlan.name,
              });

              setUserBookedTimes((prev) => new Set(prev).add(selectedSlotTime));
              setConfirmationId(`XCL-${Math.floor(100000 + Math.random() * 900000)}`);
              setStep(3);
              toast.success('Razorpay Payment verified & membership activated successfully!');
            } else {
              toast.error(verifyRes?.error || 'Payment signature verification failed.');
            }
          } catch (verifyErr) {
            toast.error(verifyErr.message || 'Error verifying Razorpay payment signature on backend.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: async function () {
            setLoading(false);
            toast.info('Payment window closed. You can retry payment anytime.');
            try {
              await apiService.reportPaymentFailure({
                razorpay_order_id: orderRes.orderId,
                reason: 'User closed Razorpay modal before completing payment',
              });
            } catch {
              // ignore reporting errors
            }
          },
        },
      };

      // 4. Open Razorpay Modal
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', async function (failedResponse) {
        setLoading(false);
        const errDesc = failedResponse.error?.description || 'Payment failed or was declined';
        toast.error(`Razorpay Error: ${errDesc}`);
        try {
          await apiService.reportPaymentFailure({
            razorpay_order_id: orderRes.orderId,
            error: failedResponse.error,
          });
        } catch {
          // ignore report errors
        }
      });

      rzp.open();
    } catch (err) {
      console.error('[Razorpay Checkout Error]', err);
      toast.error(err.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  /**
   * Fallback direct card/booking submit if testing without popup
   */
  const handleDirectPaymentSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
      return;
    }
    setLoading(true);

    try {
      const res = await apiService.createBooking({
        fullName,
        email: email || user?.email,
        phone,
        date: startDate || new Date().toISOString().split('T')[0],
        slotTime: selectedSlotTime,
        bookingType: 'membership',
        planName: selectedPlan.name,
      });

      setUserBookedTimes((prev) => new Set(prev).add(selectedSlotTime));
      setConfirmationId(`XCL-${Math.floor(100000 + Math.random() * 900000)}`);
      setStep(3);
      toast.success('Membership activated & slot reserved!');
    } catch (err) {
      toast.error(err.message || 'Failed to complete transaction.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setStep(1);
    setFullName('');
    setEmail('');
    setPhone('');
    setStartDate('');
    setPaymentResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step >= 1 ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white/40'
              }`}
            >
              1
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step >= 1 ? 'text-white' : 'text-white/40'}`}>
              Details & Slot
            </span>
          </div>

          <div className="w-8 h-[1px] bg-white/20" />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step >= 2 ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white/40'
              }`}
            >
              2
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step >= 2 ? 'text-white' : 'text-white/40'}`}>
              Payment
            </span>
          </div>

          <div className="w-8 h-[1px] bg-white/20" />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step === 3 ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white/40'
              }`}
            >
              3
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step === 3 ? 'text-white' : 'text-white/40'}`}>
              Confirmation
            </span>
          </div>
        </div>

        {/* STEP 1: USER DETAILS & SLOT SELECTION */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-2">
                Direct Plan Booking
              </span>
              <h3 className="text-2xl font-black italic uppercase text-white mt-1">
                {selectedPlan.name} — <span className="text-[#F5D76E]">{selectedPlan.priceText}</span>
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Select your preferred workout time slot (Max 4 Persons per slot).
              </p>
            </div>

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
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

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Email Address <span className="text-[#D4AF37]">*</span>
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

              {/* Preferred Start Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Membership Start Date <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  />
                </div>
              </div>

              {/* SELECT TIME SLOT */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Select Workout Slot (Max 4 Persons / Slot) <span className="text-[#D4AF37]">*</span>
                </label>

                {/* Morning Slots */}
                <div className="text-[10px] font-black uppercase tracking-widest text-[#F5D76E] mb-1.5 flex items-center gap-1">
                  <span>☀️ Morning Batches (5:00 AM - 10:00 AM)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {slots
                    .filter((s) => s.period === 'Morning')
                    .map((s) => {
                      const isSlotBooked = Boolean(s.isBooked || s.isUserBooked || s.booked >= s.max || userBookedTimes.has(s.time));
                      const availableSpots = Math.max(0, s.max - (s.booked || 0));
                      const isSelected = selectedSlotTime === s.time && !isSlotBooked;

                      return (
                        <button
                          type="button"
                          key={s.id}
                          disabled={isSlotBooked}
                          onClick={() => setSelectedSlotTime(s.time)}
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

                {/* Evening Slots */}
                <div className="text-[10px] font-black uppercase tracking-widest text-[#F5D76E] mb-1.5 flex items-center gap-1">
                  <span>🌙 Evening Batches (5:00 PM - 10:00 PM)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {slots
                    .filter((s) => s.period === 'Evening')
                    .map((s) => {
                      const isSlotBooked = Boolean(s.isBooked || s.isUserBooked || s.booked >= s.max || userBookedTimes.has(s.time));
                      const availableSpots = Math.max(0, s.max - (s.booked || 0));
                      const isSelected = selectedSlotTime === s.time && !isSlotBooked;

                      return (
                        <button
                          type="button"
                          key={s.id}
                          disabled={isSlotBooked}
                          onClick={() => setSelectedSlotTime(s.time)}
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

              <button
                type="submit"
                className="w-full py-4 mt-4 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl"
              >
                Proceed to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: PAYMENT DETAILS & RAZORPAY INTEGRATION */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black italic uppercase text-white">SELECT PAYMENT METHOD</h3>
              <p className="text-xs text-white/50 mt-1">
                Plan: <span className="text-white font-bold">{selectedPlan.name}</span> | Slot:{' '}
                <span className="text-[#F5D76E] font-bold">{selectedSlotTime}</span>
              </p>
              <div className="text-2xl font-black text-[#F5D76E] mt-1">{selectedPlan.priceText}</div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`py-3.5 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'razorpay'
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#F5D76E] shadow-lg shadow-[#D4AF37]/10'
                    : 'bg-black border-white/10 text-white/50 hover:border-white/20'
                }`}
              >
                <Zap className="w-4 h-4 text-[#D4AF37]" /> Razorpay Gateway
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3.5 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#F5D76E] shadow-lg shadow-[#D4AF37]/10'
                    : 'bg-black border-white/10 text-white/50 hover:border-white/20'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Credit / Debit Card
              </button>
            </div>

            {/* RAZORPAY PAYMENT OPTION */}
            {paymentMethod === 'razorpay' && (
              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-[#D4AF37]/30 text-center space-y-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#F5D76E] flex items-center justify-center mx-auto">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase tracking-wider text-white">Razorpay Secure Checkout</h4>
                  <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto leading-relaxed">
                    Pay securely using UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, or Digital Wallets via Razorpay Test Gateway.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Test Mode Encryption
                </div>
              </div>
            )}

            {/* DIRECT CARD FALLBACK FORM */}
            {paymentMethod === 'card' && (
              <form onSubmit={handleDirectPaymentSubmit} className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8941"
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      CVV Code
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-4 bg-black border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {paymentMethod === 'razorpay' ? (
                <button
                  type="button"
                  onClick={handleRazorpayPayment}
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl"
                >
                  {loading ? 'Initiating Razorpay...' : `Pay ${selectedPlan.priceText} with Razorpay`}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDirectPaymentSubmit}
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl"
                >
                  {loading ? 'Processing...' : `Pay ${selectedPlan.priceText}`}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: MEMBERSHIP CONFIRMATION */}
        {step === 3 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F5D76E] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(212,175,55,0.5)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-3xl font-black italic uppercase text-white">MEMBERSHIP ACTIVATED!</h3>
            <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
              Welcome to Xclusive Gym, <span className="text-[#F5D76E] font-bold">{fullName}</span>! Your membership plan is active and signature verified on backend.
            </p>

            <div className="p-5 rounded-2xl bg-black border border-[#D4AF37]/40 text-xs text-left max-w-md mx-auto space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-white/50 uppercase tracking-widest font-bold">Confirmation ID</span>
                <span className="text-[#F5D76E] font-black">{confirmationId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Plan Purchased</span>
                <span className="text-white font-bold">{selectedPlan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Assigned Workout Slot</span>
                <span className="text-[#F5D76E] font-bold">{selectedSlotTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Start Date</span>
                <span className="text-white">{startDate || 'Immediate'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Rate</span>
                <span className="text-[#F5D76E] font-bold">{selectedPlan.priceText}</span>
              </div>

              {/* Razorpay Details */}
              {paymentResult && (
                <div className="pt-2 border-t border-white/10 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Razorpay Payment ID</span>
                    <span className="text-emerald-400 font-mono font-bold truncate max-w-[200px]">{paymentResult.paymentId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Razorpay Order ID</span>
                    <span className="text-white/80 font-mono truncate max-w-[200px]">{paymentResult.orderId}</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>Signature Verification</span>
                    <span>✓ VERIFIED (HMAC-SHA256)</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleFinish}
              className="mt-4 px-8 py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/20 rounded-xl"
            >
              Access Athlete Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
