import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, User, LogOut, ChevronDown } from 'lucide-react';

export const Navbar = ({
  user,
  onOpenAuth,
  onOpenProfile,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

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

  // Close dropdown menu on click outside (Handles both Desktop & Mobile refs properly)
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedDesktop = desktopDropdownRef.current && desktopDropdownRef.current.contains(e.target);
      const clickedMobile = mobileDropdownRef.current && mobileDropdownRef.current.contains(e.target);
      if (!clickedDesktop && !clickedMobile) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Trial Pass', href: '#trial' },
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

        {/* Desktop Nav Links - Always working for all users */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 hover:text-white transition-colors py-1 relative group flex items-center gap-1"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Buttons (Desktop View) */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={desktopDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="px-3.5 py-2 rounded-full bg-zinc-900 border border-[#D4AF37]/50 text-xs font-bold text-white hover:border-[#D4AF37] hover:bg-zinc-800 transition-all flex items-center gap-2.5 cursor-pointer shadow-md"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black text-xs font-black flex items-center justify-center shadow">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Desktop User Avatar Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-white/50 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-white/90 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059] text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
            >
              <User className="w-3.5 h-3.5" /> Log In
            </button>
          )}
        </div>

        {/* Mobile & Tablet View Action Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          {user ? (
            <div className="relative" ref={mobileDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="px-3 py-1.5 rounded-full bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <span>{user.name ? user.name.split(' ')[0] : 'User'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-zinc-950 border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-1.5 z-50 backdrop-blur-xl">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
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
                <span>{link.name}</span>
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" /> Athlete Login / Sign Up
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full py-3 rounded-xl bg-zinc-900 border border-[#D4AF37] text-[#D4AF37] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> My Profile
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
