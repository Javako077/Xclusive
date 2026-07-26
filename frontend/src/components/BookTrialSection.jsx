import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, Dumbbell, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const BookTrialSection = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [trainingType, setTrainingType] = useState('Personal Training');
  const [sessionType, setSessionType] = useState('In-Person');

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section id="trial" className="py-24 bg-black text-white relative border-t border-[#D4AF37]/20 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.14),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-zinc-950/90 border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-12 shadow-2xl relative">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F5D76E] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(212,175,55,0.5)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black italic uppercase text-white">TRIAL SESSION RESERVED!</h3>
              <p className="text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
                Thank you, <span className="text-[#F5D76E] font-bold">{fullName}</span>! Your complimentary <span className="text-[#F5D76E] font-bold">{trainingType} ({sessionType})</span> session is set for <span className="text-[#F5D76E] font-bold">{preferredDate || 'your requested date'} at {preferredTime}</span>.
              </p>
              <div className="p-4 rounded-2xl bg-black border border-white/10 text-xs text-left max-w-md mx-auto space-y-1 text-white/70">
                <div><strong className="text-white">Email:</strong> {email}</div>
                <div><strong className="text-white">Phone:</strong> {phone}</div>
                <div><strong className="text-white">Session Type:</strong> {sessionType}</div>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFullName('');
                  setEmail('');
                  setPhone('');
                }}
                className="mt-4 px-8 py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
              >
                Book Another Trial Session
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-block mb-3">
                  <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Exclusive Pass
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tight text-white mb-2">
                  BOOK YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16]">FREE TRIAL</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto">
                  Experience full access to our world-class gym floor, specialized lifting pods, and expert coach assessment with zero risk.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
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
                        className="w-full pl-10 pr-4 py-3.5 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
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
                        className="w-full pl-10 pr-4 py-3.5 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Number & Preferred Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
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
                        className="w-full pl-10 pr-4 py-3.5 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                      Preferred Date <span className="text-[#D4AF37]">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Time & Select Training Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                      Preferred Time <span className="text-[#D4AF37]">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                      >
                        <option value="07:00 AM">07:00 AM - Morning Slot</option>
                        <option value="09:00 AM">09:00 AM - Morning Slot</option>
                        <option value="11:00 AM">11:00 AM - Midday Slot</option>
                        <option value="02:00 PM">02:00 PM - Afternoon Slot</option>
                        <option value="05:00 PM">05:00 PM - Evening Slot</option>
                        <option value="07:00 PM">07:00 PM - Night Slot</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                      Select Training Type <span className="text-[#D4AF37]">*</span>
                    </label>
                    <div className="relative">
                      <Dumbbell className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      <select
                        value={trainingType}
                        onChange={(e) => setTrainingType(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                      >
                        <option value="Personal Training">Personal Training</option>
                        <option value="Strength Training">Strength Training</option>
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Muscle Building">Muscle Building</option>
                        <option value="Functional Training">Functional Training</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Session Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                    Session Type <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSessionType('In-Person')}
                      className={`py-3.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        sessionType === 'In-Person'
                          ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black border-[#F5D76E] shadow-lg'
                          : 'bg-black border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      In-Person
                    </button>
                    <button
                      type="button"
                      onClick={() => setSessionType('Online')}
                      className={`py-3.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        sessionType === 'Online'
                          ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black border-[#F5D76E] shadow-lg'
                          : 'bg-black border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      Online
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-4 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/20"
                >
                  {loading ? 'Reserving Session...' : 'Book Your Free Trial Now'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
