import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, KeyRound, AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';

export const AdminLoginPage = ({ onAdminLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both Email and Password fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiService.adminLogin({ email, password });
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess(res.admin);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin Login Error:', err);
      setError(err.message || 'Email or password wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* Dynamic Metallic Ambient Lighting Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-950 border-2 border-[#D4AF37]/40 text-[#F5D76E] shadow-[0_0_30px_rgba(212,175,55,0.2)] mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <div className="inline-block mb-1">
            <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-2 flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3 h-3" /> System Security Portal
            </span>
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tight text-white">
            ADMIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16]">CONSOLE</span>
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Authorized administrator access portal only.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-zinc-950/90 border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          {/* Top Security Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center gap-3">
            <Lock className="w-4 h-4 text-[#F5D76E] shrink-0" />
            <p className="text-[11px] text-[#F5D76E] leading-tight">
              <strong className="font-bold">Encrypted Connection:</strong> Session authentication uses 256-bit JWT token encryption.
            </p>
          </div>

          {/* Error Feedback */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-400 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Admin Email Address <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@xclusive.com"
                  className="w-full pl-10 pr-4 py-3.5 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                  Password <span className="text-[#D4AF37]">*</span>
                </label>
                <Link
                  to="/admin/forgot-password"
                  className="text-xs text-[#D4AF37] hover:text-[#F5D76E] font-medium transition-colors cursor-pointer"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3.5 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-black border-white/20 text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                />
                <span>Maintain session token</span>
              </label>
              <span className="text-[10px] text-white/30 font-mono">ROLE: ADMINISTRATOR</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Access Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Explicit Note regarding registration */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] text-white/40 leading-relaxed">
              No public registration available. Admin accounts are managed directly through backend server credentials.
            </p>
            <div className="mt-3">
              <Link
                to="/"
                className="text-xs text-white/60 hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
              >
                ← Return to Public Website
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="text-center mt-6 text-[11px] text-white/30">
          Xclusive Fitness Security Console • MERN Stack System
        </div>
      </div>
    </div>
  );
};
