import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck, ExternalLink } from 'lucide-react';
import { apiService } from '../services/api';

export const ContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('Personal Training & Coaching');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    try {
      await apiService.submitContact({ name, email, phone, goal, message });
      setSubmitted(true);
    } catch (err) {
      console.error('Contact API error:', err);
      alert(err.message || 'Error submitting message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-black relative border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B9FF00]/10 border border-[#B9FF00]/30 rounded-full text-[#B9FF00] text-xs font-black uppercase tracking-widest mb-4">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Get In Touch</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tight text-white">
                START YOUR <span className="text-[#B9FF00]">TRANSFORMATION</span>
              </h2>
              <p className="text-white/60 text-sm mt-3 leading-relaxed">
                Have questions about our athletic facilities, high-performance coaching, or custom membership tiers? Reach out directly to our team.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-zinc-950 border border-white/10 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-[#B9FF00]/10 rounded-xl text-[#B9FF00]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">Headquarters & Facility</h4>
                  <p className="text-xs text-white/60 mt-0.5">742 Olympic Way, Performance District, NY 10001</p>
                </div>
              </div>

              <div className="p-4 bg-zinc-950 border border-white/10 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-[#B9FF00]/10 rounded-xl text-[#B9FF00]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">Concierge & Bookings</h4>
                  <p className="text-xs text-white/60 mt-0.5">+1 (800) 555-APEX / (800) 555-2739</p>
                </div>
              </div>

              <div className="p-4 bg-zinc-950 border border-white/10 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-[#B9FF00]/10 rounded-xl text-[#B9FF00]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">Direct Email</h4>
                  <p className="text-xs text-white/60 mt-0.5">concierge@apexathleticlab.com</p>
                </div>
              </div>

              <div className="p-4 bg-zinc-950 border border-white/10 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-[#B9FF00]/10 rounded-xl text-[#B9FF00]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">Facility Operating Hours</h4>
                  <p className="text-xs text-white/60 mt-0.5">Mon–Fri: 05:00 – 23:00 | Sat–Sun: 06:00 – 22:00 (24/7 VIP keycard access)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-10 relative">
              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-[#B9FF00]/10 text-[#B9FF00] border border-[#B9FF00]/30 rounded-3xl flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase text-white">MESSAGE TRANSMITTED</h3>
                  <p className="text-xs text-white/60 max-w-sm mx-auto">
                    Thank you, <span className="text-white font-bold">{name}</span>. An APEX athletic performance specialist will review your inquiry and connect via email shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-black italic uppercase text-white mb-2">
                    SEND AN <span className="text-[#B9FF00]">ATHLETE INQUIRY</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Marcus Vance"
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#B9FF00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="marcus@performance.com"
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#B9FF00]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 019-2831"
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#B9FF00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Inquiry Topic</label>
                      <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#B9FF00] cursor-pointer"
                      >
                        <option value="Personal Training & Coaching">Personal Training & Coaching</option>
                        <option value="VIP Keycard & Membership Tiers">VIP Keycard & Membership Tiers</option>
                        <option value="Corporate / Group Passes">Corporate / Group Passes</option>
                        <option value="Facility Day Pass Inquiry">Facility Day Pass Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Message Details</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your fitness goals, preferred coaching schedule, or facility questions..."
                      className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#B9FF00] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#B9FF00] text-black font-black text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#B9FF00]/10"
                  >
                    {loading ? 'Transmitting...' : 'Submit Inquiry'}
                    {!loading && <Send className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
