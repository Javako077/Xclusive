import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Eye, EyeOff, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { apiService } from '../services/api';

export const AuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'signup',
}) => {
  const [tab, setTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState('Muscle Building & Hypertrophy');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab || 'signup');
      setErrorMsg(null);
      setResetSent(false);
      setSignupSuccess(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (tab === 'forgot') {
      if (!email) {
        setErrorMsg('Please enter your registered email address.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setResetSent(true);
      }, 700);
      return;
    }

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (tab === 'signup' && !name) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      if (tab === 'signup') {
        const user = await apiService.signup({ name, email, password, goal });
        setSignupSuccess(true);
        setTimeout(() => {
          setSignupSuccess(false);
          setTab('login'); // Firstly signup completed, now open login page!
        }, 1200);
      } else {
        const user = await apiService.login({ email, password });
        onSuccess(user);
        onClose();
      }
    } catch (err) {
      console.error('Auth API Error:', err);
      setErrorMsg(err.message || 'Server error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userProfile = {
        id: 'usr_social_' + Math.random().toString(36).substring(2, 9),
        name: `Athlete (${provider})`,
        email: `athlete.${provider.toLowerCase()}@xclusivegym.com`,
        membershipPlan: 'PRO ATHLETE PASS',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        savedPlans: [],
      };
      onSuccess(userProfile);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-950 border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-950 border-2 border-[#D4AF37] p-1.5 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(212,175,55,0.4)] overflow-hidden">
            <img
              src="/Xclusivelogo.png"
              alt="Xclusive Gym"
              className="w-full h-full object-contain rounded-full brightness-110 contrast-125"
            />
          </div>
          <h3 className="text-2xl font-black italic uppercase tracking-tight text-white">
            XCLUSIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16]">ATHLETE PORTAL</span>
          </h3>
          <p className="text-xs text-white/50 mt-1">
            {tab === 'signup'
              ? 'Create your athlete account to get started'
              : tab === 'login'
              ? 'Access your training plans & membership'
              : 'Password Recovery & Security'}
          </p>
        </div>

        {/* Navigation Tabs (Signup / Login) */}
        {tab !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-black border border-white/10 rounded-xl mb-6">
            <button
              onClick={() => {
                setTab('signup');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-black uppercase tracking-widest transition-all rounded-lg cursor-pointer ${
                tab === 'signup'
                  ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black shadow'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setTab('login');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-black uppercase tracking-widest transition-all rounded-lg cursor-pointer ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black shadow'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Log In
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {signupSuccess && (
            <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37] text-[#F5D76E] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              Account registered! Opening Login Page now...
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {tab === 'forgot' ? (
            <div className="space-y-4">
              {resetSent ? (
                <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37] text-center space-y-2">
                  <KeyRound className="w-8 h-8 text-[#F5D76E] mx-auto" />
                  <h4 className="text-sm font-black uppercase text-white">Reset Link Transmitted</h4>
                  <p className="text-xs text-white/70">
                    We have sent password recovery instructions to <span className="text-[#F5D76E] font-bold">{email}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      setResetSent(false);
                    }}
                    className="mt-3 px-4 py-2 bg-black border border-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white/10"
                  >
                    Return To Login
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">Registered Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="athlete@xclusivegym.com"
                        className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10"
                  >
                    {loading ? 'Transmitting...' : 'Send Reset Link'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="text-xs text-white/50 hover:text-[#F5D76E] transition-colors cursor-pointer"
                    >
                      Back to Log In
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              {/* SIGNUP FIELD: NAME */}
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              )}

              {/* EMAIL FIELD */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@xclusivegym.com"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* SIGNUP FIELD: FITNESS GOAL */}
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">Primary Fitness Goal</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  >
                    <option value="Muscle Building & Hypertrophy">Muscle Building & Hypertrophy</option>
                    <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                    <option value="Powerlifting & Strength Peak">Powerlifting & Strength Peak</option>
                    <option value="Olympic Weightlifting">Olympic Weightlifting</option>
                    <option value="General Fitness">General Fitness</option>
                  </select>
                </div>
              )}

              {/* LOGIN EXTRA LINKS: REMEMBER ME & FORGOT PASSWORD */}
              {tab === 'login' && (
                <div className="flex items-center justify-between text-xs text-white/60 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" defaultChecked className="accent-[#D4AF37] rounded cursor-pointer" />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      setErrorMsg(null);
                    }}
                    className="text-[#F5D76E] hover:underline font-bold transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10"
              >
                {loading
                  ? 'Processing...'
                  : tab === 'signup'
                  ? 'Create Athlete Account'
                  : 'Log In to Portal'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </>
          )}
        </form>

        {/* Divider */}
        {tab !== 'forgot' && (
          <>
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-zinc-950 text-[10px] font-bold uppercase tracking-widest text-white/30">
                Or Continue With
              </span>
            </div>

            {/* Social logins */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSocialAuth('Google')}
                className="py-2.5 bg-black border border-white/10 rounded-xl text-xs font-bold text-white/70 hover:text-white hover:border-white/30 transition-all cursor-pointer"
              >
                Google
              </button>
              <button
                onClick={() => handleSocialAuth('Apple')}
                className="py-2.5 bg-black border border-white/10 rounded-xl text-xs font-bold text-white/70 hover:text-white hover:border-white/30 transition-all cursor-pointer"
              >
                Apple
              </button>
              <button
                onClick={() => handleSocialAuth('Strava')}
                className="py-2.5 bg-black border border-white/10 rounded-xl text-xs font-bold text-[#F5D76E] hover:border-[#D4AF37]/50 transition-all cursor-pointer"
              >
                Strava
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
