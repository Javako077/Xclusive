import React, { useState, useEffect } from 'react';
import { Dumbbell, Menu, X, ChevronRight, User } from 'lucide-react';

export const Navbar = ({
  user,
  onOpenAuth,
  onOpenProfile,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Free Trial', href: '#trial' },
    { name: 'Classes', href: '#classes' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Memberships', href: '#memberships' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
          : 'bg-gradient-to-b from-black via-black/80 to-transparent py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group shrink-0 py-1">
          <div className="w-10 h-10 sm:w-10 sm:h-10 lg:w-10 lg:h-10 rounded-full bg-zinc-950 border-2 border-[#D4AF37] p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] group-hover:border-[#FFD700] group-hover:scale-105 transition-all duration-300 overflow-hidden shrink-0">
            <img
              src="/Xclusivelogo.png"
              alt="Xclusive Gym & Wellness"
              className="w-full h-full object-contain rounded-full brightness-110 contrast-125"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl sm:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] drop-shadow-[0_2px_4px_#000000]">
              XCLUSIVE
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-[#F5D76E]/90 uppercase mt-0.5">
              WHERE FITNESS BECOMES A LIFESTYLE
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 hover:text-white transition-colors py-1 relative group flex items-center gap-1"
            >
              {link.name}
              {link.badge && (
                <span className="px-1.5 py-0.2 rounded bg-[#D4AF37] text-black text-[8px] font-black uppercase">
                  {link.badge}
                </span>
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* User Auth or Profile Button */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="px-3.5 py-2 rounded-full bg-zinc-900 border border-[#D4AF37]/40 text-xs font-bold text-white hover:border-[#D4AF37] transition-all flex items-center gap-2 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-black flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[100px] truncate">{user.name}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059] text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
            >
              <User className="w-3.5 h-3.5" /> Log In
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          {user ? (
            <button
              onClick={onOpenProfile}
              className="px-3 py-1.5 rounded-full bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              {user.name.split(' ')[0]}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Log In
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white hover:text-[#D4AF37] focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950/98 backdrop-blur-2xl border-b border-white/10 px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white/80 hover:bg-white/5 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 bg-[#D4AF37] text-black text-[9px] font-black rounded">
                      {link.badge}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            {!user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-3 rounded-none bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" /> Athlete Login / Sign Up
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="w-full py-3 rounded-none bg-zinc-900 border border-[#D4AF37] text-[#D4AF37] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" /> My Athlete Profile
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

