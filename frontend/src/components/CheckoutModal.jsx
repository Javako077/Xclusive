import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, User, Mail, Phone, Lock, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose, selectedPlan }) => {
  const [step, setStep] = useState(1); // 1: User Details, 2: Payment, 3: Confirmation

  // User Details State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Payment Details State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationId, setConfirmationId] = useState('');

  if (!isOpen || !selectedPlan) return null;

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setConfirmationId(`XCL-${Math.floor(100000 + Math.random() * 900000)}`);
      setStep(3);
    }, 1200);
  };

  const handleFinish = () => {
    setStep(1);
    setFullName('');
    setEmail('');
    setPhone('');
    setCardName('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
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
              Details
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

        {/* STEP 1: USER DETAILS */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-2">
                Selected Plan
              </span>
              <h3 className="text-2xl font-black italic uppercase text-white mt-1">
                {selectedPlan.name} — <span className="text-[#F5D76E]">{selectedPlan.priceText}</span>
              </h3>
              <p className="text-xs text-white/50">Enter your athlete contact details to proceed.</p>
            </div>

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
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
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-2 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
              >
                Proceed to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: PAYMENT DETAILS */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black italic uppercase text-white">SECURE PAYMENT</h3>
              <p className="text-xs text-white/50 mt-1">
                Order Total: <span className="text-[#F5D76E] font-bold">{selectedPlan.priceText}</span>
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#F5D76E]'
                    : 'bg-black border-white/10 text-white/50'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Credit / Debit
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('digital')}
                className={`py-3 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'digital'
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#F5D76E]'
                    : 'bg-black border-white/10 text-white/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Apple / Google Pay
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {paymentMethod === 'card' ? (
                <>
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
                </>
              ) : (
                <div className="p-6 rounded-2xl bg-black border border-white/10 text-center space-y-3">
                  <ShieldCheck className="w-10 h-10 text-[#F5D76E] mx-auto animate-pulse" />
                  <p className="text-xs text-white/70">
                    Click submit below to complete payment via your default Digital Wallet (Apple Pay / Google Pay / UPI).
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-4 bg-black border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
                >
                  {loading ? 'Processing Payment...' : `Pay ${selectedPlan.priceText}`}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: MEMBERSHIP CONFIRMATION */}
        {step === 3 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F5D76E] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(212,175,55,0.5)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-3xl font-black italic uppercase text-white">MEMBERSHIP CONFIRMED!</h3>
            <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
              Welcome to Xclusive Gym, <span className="text-[#F5D76E] font-bold">{fullName}</span>! Your membership pass is active.
            </p>

            <div className="p-5 rounded-2xl bg-black border border-[#D4AF37]/40 text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-white/50 uppercase tracking-widest font-bold">Confirmation ID</span>
                <span className="text-[#F5D76E] font-black">{confirmationId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Plan Purchased</span>
                <span className="text-white font-bold">{selectedPlan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Rate</span>
                <span className="text-[#F5D76E] font-bold">{selectedPlan.priceText}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Member Email</span>
                <span className="text-white">{email}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="mt-4 px-8 py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/20"
            >
              Access Athlete Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
