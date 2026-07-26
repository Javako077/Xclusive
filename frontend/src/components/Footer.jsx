import React, { useState } from 'react';
import { Dumbbell, MapPin, Phone, Mail, Clock, Send, Instagram, Youtube, Twitter } from 'lucide-react';

export const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-black text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#hero" className="inline-flex items-center gap-3.5 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-950 border-2 border-[#D4AF37] p-2 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.7)] group-hover:border-[#FFD700] group-hover:scale-105 transition-all duration-300 overflow-hidden shrink-0">
                <img
                  src="/Xclusivelogo.png"
                  alt="Xclusive Gym & Wellness"
                  className="w-full h-full object-contain rounded-full brightness-110 contrast-125"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] drop-shadow-[0_2px_4px_#000000]">
                  XCLUSIVE
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-[#F5D76E]/90 uppercase mt-1">
                  WHERE FITNESS BECOMES A LIFESTYLE
                </span>
              </div>
            </a>

            <p className="text-xs text-white/50 leading-relaxed max-w-sm">
              The premier performance gym, Olympic lifting floor, and recovery suite designed for athletes, fitness enthusiasts, and beginners striving for peak physical conditioning.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2.5 rounded-full bg-zinc-950 border border-white/10 text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-zinc-950 border border-white/10 text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-zinc-950 border border-white/10 text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Facility Hours
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/40">Monday - Friday:</span>
                <span className="font-bold text-white">5:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-white/40">Saturday - Sunday:</span>
                <span className="font-bold text-white">6:00 AM - 9:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/40">VIP Pro Keycard:</span>
                <span className="font-black text-[#D4AF37] italic">24 / 7 ACCESS</span>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Location & Contact
            </h4>
            <div className="space-y-2 text-xs text-white/70">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <span>742 Olympic Way, Performance District, NY 10001</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white/40 shrink-0" />
                <span>+1 (800) 555-XCLUSIVE (9258)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white/40 shrink-0" />
                <span>info@xclusivegymfitness.com</span>
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Weekly Workout Tips
            </h4>
            <p className="text-xs text-white/50">Get free training guides & nutrition templates delivered weekly.</p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-none bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-none bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059] text-black font-black text-xs hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-widest"
                >
                  <Send className="w-3.5 h-3.5" /> Subscribe
                </button>
              </form>
            ) : (
              <div className="p-3 rounded-none bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                ✓ Subscribed to Xclusive Weekly
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <div>© {new Date().getFullYear()} Xclusive Gym & Athletic Performance Center. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Facility Rules</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
