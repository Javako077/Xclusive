import React, { useState, useEffect } from 'react';
import { Dumbbell, Menu, X, Flame, ChevronRight, Play, User } from 'lucide-react';

export const Navbar = ({
  onOpenFreePass,
  onOpenVirtualTour,
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
    { name: 'Classes', href: '#classes' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Coaches', href: '#trainers' },
    { name: 'AI Coach', href: '#ai-coach', badge: 'AI' },
    { name: 'Memberships', href: '#memberships' },
    { name: 'Calculators', href: '#calculators' },
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
        <a href="#hero" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#B9FF00] flex items-center justify-center text-black font-black shadow-lg shadow-[#B9FF00]/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="text-xl font-black italic tracking-tighter text-white flex items-center">
              APEX<span className="text-[#B9FF00] ml-0.5">.</span>
            </div>
            <div className="text-[9px] font-bold text-white/40 tracking-[0.25em] uppercase -mt-1">
              Athletic Lab
            </div>
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
                <span className="px-1.5 py-0.2 rounded bg-[#B9FF00] text-black text-[8px] font-black uppercase">
                  {link.badge}
                </span>
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B9FF00] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenVirtualTour}
            className="px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white/80 bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-[#B9FF00] fill-[#B9FF00]" /> Tour
          </button>

          <button
            onClick={onOpenFreePass}
            className="px-4 py-2.5 rounded-none font-black text-xs uppercase tracking-widest bg-[#B9FF00] text-black hover:scale-105 transition-transform shadow-lg shadow-[#B9FF00]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-black" /> Free Pass
          </button>

          {/* User Auth or Profile Button */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="px-3.5 py-2 rounded-full bg-zinc-900 border border-[#B9FF00]/40 text-xs font-bold text-white hover:border-[#B9FF00] transition-all flex items-center gap-2 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#B9FF00] text-black text-xs font-black flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[100px] truncate">{user.name}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-full bg-black border border-white/20 text-xs font-bold uppercase tracking-wider text-white hover:border-[#B9FF00] hover:text-[#B9FF00] transition-all flex items-center gap-1.5 cursor-pointer"
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
              className="px-3 py-1.5 rounded-full bg-[#B9FF00] text-black font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              {user.name.split(' ')[0]}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
            >
              Log In
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white hover:text-[#B9FF00] focus:outline-none cursor-pointer"
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
                className="px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white/80 hover:bg-white/5 hover:text-[#B9FF00] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 bg-[#B9FF00] text-black text-[9px] font-black rounded">
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
                className="w-full py-3 rounded-none bg-black border border-white/20 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" /> Athlete Login / Sign Up
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="w-full py-3 rounded-none bg-zinc-900 border border-[#B9FF00] text-[#B9FF00] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" /> My Athlete Profile
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFreePass();
              }}
              className="w-full py-3 rounded-none bg-[#B9FF00] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#B9FF00]/20"
            >
              <Flame className="w-4 h-4 fill-black" /> Claim 3-Day Free Pass
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
