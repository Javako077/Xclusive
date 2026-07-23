import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Dumbbell, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';

export const AuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'login',
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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

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
      let user;
      if (tab === 'signup') {
        user = await apiService.signup({ name, email, password, goal });
      } else {
        user = await apiService.login({ email, password });
      }

      onSuccess(user);
      onClose();
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
        email: `athlete.${provider.toLowerCase()}@apexgym.com`,
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
      <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#B9FF00] text-black font-black mb-3">
            <Dumbbell className="w-6 h-6 -rotate-45" />
          </div>
          <h3 className="text-2xl font-black italic uppercase tracking-tight text-white">
            APEX <span className="text-[#B9FF00]">ATHLETE PORTAL</span>
          </h3>
          <p className="text-xs text-white/50 mt-1">
            {tab === 'login' ? 'Access your training plans & membership' : 'Join the elite athletic performance community'}
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 p-1 bg-black border border-white/10 rounded-xl mb-6">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-black uppercase tracking-widest transition-all rounded-lg cursor-pointer ${
              tab === 'login' ? 'bg-[#B9FF00] text-black shadow' : 'text-white/40 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-black uppercase tracking-widest transition-all rounded-lg cursor-pointer ${
              tab === 'signup' ? 'bg-[#B9FF00] text-black shadow' : 'text-white/40 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

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
                  className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#B9FF00]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@apexgym.com"
                className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#B9FF00]"
              />
            </div>
          </div>

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
                className="w-full pl-10 pr-10 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#B9FF00]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">Primary Fitness Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#B9FF00] cursor-pointer"
              >
                <option value="Muscle Building & Hypertrophy">Muscle Building & Hypertrophy</option>
                <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                <option value="Powerlifting & 1RM Peak">Powerlifting & Strength Peak</option>
                <option value="Olympic Weightlifting">Olympic Weightlifting</option>
                <option value="General Fitness">General Fitness</option>
              </select>
            </div>
          )}

          {tab === 'login' && (
            <div className="flex items-center justify-between text-xs text-white/50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#B9FF00] rounded" />
                <span>Remember me</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Reset link sent to your email.'); }} className="hover:text-[#B9FF00] transition-colors">
                Forgot Password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#B9FF00] text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#B9FF00]/10"
          >
            {loading ? 'Processing...' : tab === 'login' ? 'Log In to Portal' : 'Create Athlete Account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Divider */}
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
            className="py-2.5 bg-black border border-white/10 rounded-xl text-xs font-bold text-[#B9FF00] hover:border-[#B9FF00]/50 transition-all cursor-pointer"
          >
            Strava
          </button>
        </div>
      </div>
    </div>
  );
};
