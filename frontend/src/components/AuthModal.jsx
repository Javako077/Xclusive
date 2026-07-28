import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { apiService } from '../services/api';

export const AuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'signup',
}) => {
  const [tab, setTab] = useState(initialTab); // 'signup' | 'login' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState('Muscle Building & Hypertrophy');
  const [role, setRole] = useState('user'); // 'user' | 'admin' | 'staff'

  // Forgot password & OTP state
  const [otpMethod, setOtpMethod] = useState('email'); // 'email' | 'phone'
  const [recoveryTarget, setRecoveryTarget] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1: Send OTP, 2: Enter OTP & New Pass, 3: Success
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  // UI state
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab || 'signup');
      setErrorMsg(null);
      setSuccessMsg(null);
      setSignupSuccess(false);
      setOtpStep(1);
      setOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
      setDemoOtp('');
    }
  }, [isOpen, initialTab]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  // Handle Login / Signup submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (tab === 'signup') {
      if (!name || !email || !password) {
        setErrorMsg('Please complete all required fields (Name, Email, and Password).');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
    } else if (tab === 'login') {
      if (!email || !password) {
        setErrorMsg('Please enter your email or mobile number and password.');
        return;
      }
    }

    setLoading(true);

    try {
      if (tab === 'signup') {
        await apiService.signup({ name, email, phone, password, goal, role });
        setSignupSuccess(true);
        setTimeout(() => {
          setSignupSuccess(false);
          setTab('login');
        }, 1300);
      } else {
        const user = await apiService.login({ email, password, role });
        onSuccess(user);
        onClose();
      }
    } catch (err) {
      console.error('Auth API Error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to Email or Mobile
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!recoveryTarget.trim()) {
      setErrorMsg(
        otpMethod === 'phone'
          ? 'Please enter your registered mobile number.'
          : 'Please enter your registered email address.'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.sendOtp({
        recoveryTarget: recoveryTarget.trim(),
        method: otpMethod,
      });

      setSuccessMsg(res.message || `OTP sent to your ${otpMethod}.`);
      if (res.demoOtp) {
        setDemoOtp(res.demoOtp);
      }
      setOtpStep(2);
      setCountdown(45);
    } catch (err) {
      console.error('Send OTP Error:', err);
      setErrorMsg(err.message || 'Failed to send OTP code. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleVerifyOtpAndReset = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!otpCode.trim()) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    if (!newPassword) {
      setErrorMsg('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.verifyOtpAndResetPassword({
        recoveryTarget: recoveryTarget.trim(),
        otp: otpCode.trim(),
        newPassword,
      });

      setSuccessMsg(res.message || 'Password reset successfully!');
      setOtpStep(3);
    } catch (err) {
      console.error('Verify OTP Error:', err);
      setErrorMsg(err.message || 'Invalid or expired OTP code.');
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
        phone: '+1 (555) 019-2834',
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
      <div className="relative w-full max-w-md bg-zinc-950 border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
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
              : 'Password Recovery via Email or Mobile OTP'}
          </p>
        </div>

        {/* Navigation Tabs (Signup / Login) */}
        {tab !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-black border border-white/10 rounded-xl mb-6">
            <button
              onClick={() => {
                setTab('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
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
                setSuccessMsg(null);
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

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium leading-relaxed">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#F5D76E] text-xs font-medium leading-relaxed flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {signupSuccess && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37] text-[#F5D76E] text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            Registration successful! Directing to Login now...
          </div>
        )}

        {/* ========================================================= */}
        {/* FORGOT PASSWORD VIEW (OTP VIA EMAIL OR MOBILE) */}
        {/* ========================================================= */}
        {tab === 'forgot' ? (
          <div className="space-y-4">
            {/* STEP 1: Select Email/Mobile & Enter Target */}
            {otpStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {/* Delivery Method Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                    Send OTP Code Via
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-black border border-white/10 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpMethod('email');
                        setErrorMsg(null);
                      }}
                      className={`py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        otpMethod === 'email'
                          ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F5D76E]'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpMethod('phone');
                        setErrorMsg(null);
                      }}
                      className={`py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        otpMethod === 'phone'
                          ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F5D76E]'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      Mobile Number
                    </button>
                  </div>
                </div>

                {/* Target Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                    {otpMethod === 'email' ? 'Registered Email Address' : 'Registered Mobile Number'}
                  </label>
                  <div className="relative">
                    {otpMethod === 'email' ? (
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    ) : (
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    )}
                    <input
                      type={otpMethod === 'email' ? 'email' : 'tel'}
                      required
                      value={recoveryTarget}
                      onChange={(e) => setRecoveryTarget(e.target.value)}
                      placeholder={
                        otpMethod === 'email'
                          ? 'athlete@xclusivegym.com'
                          : '+1 (555) 000-1234 or 9876543210'
                      }
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10"
                >
                  {loading ? 'Sending OTP Code...' : 'Send OTP Code'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      setErrorMsg(null);
                    }}
                    className="text-xs text-white/50 hover:text-[#F5D76E] transition-colors cursor-pointer"
                  >
                    ← Back to Log In
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Enter OTP Code & Set New Password */}
            {otpStep === 2 && (
              <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
                {/* Demo OTP Banner if present */}
                {demoOtp && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono text-center">
                    ⚡ DEMO VERIFICATION OTP CODE: <span className="font-black text-sm tracking-widest text-[#F5D76E]">{demoOtp}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 bg-black border border-[#D4AF37]/50 rounded-xl text-white text-base tracking-[0.3em] font-mono text-center focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1.5 text-[11px] text-white/40">
                    <span>Sent to {recoveryTarget}</span>
                    {countdown > 0 ? (
                      <span>Resend code in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[#F5D76E] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                      >
                        <RefreshCw className="w-3 h-3" /> Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10"
                >
                  {loading ? 'Verifying & Resetting...' : 'Verify OTP & Reset Password'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep(1);
                      setErrorMsg(null);
                    }}
                    className="text-xs text-white/50 hover:text-[#F5D76E] transition-colors cursor-pointer"
                  >
                    Change Email / Mobile Number
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Password Reset Success */}
            {otpStep === 3 && (
              <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37] text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#F5D76E] mx-auto" />
                <h4 className="text-base font-black uppercase text-white">Password Updated!</h4>
                <p className="text-xs text-white/70">
                  Your password has been successfully reset. You can now log in using your new credentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(recoveryTarget);
                    setTab('login');
                    setOtpStep(1);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="mt-2 w-full py-3 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 cursor-pointer shadow-lg shadow-[#D4AF37]/10"
                >
                  Proceed to Log In
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================= */
          /* SIGNUP / LOGIN FORMS */
          /* ========================================================= */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ROLE SELECTION (1. User / 2. Admin) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                Login Role Access
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-black border border-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2.5 px-3 text-xs font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'user'
                      ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black shadow'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" /> 1. User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2.5 px-3 text-xs font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'admin'
                      ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black shadow'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> 2. Admin
                </button>
              </div>
            </div>
            {/* SIGNUP: FULL NAME */}
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                  Full Name <span className="text-[#D4AF37]">*</span>
                </label>
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

            {/* EMAIL ADDRESS */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                {tab === 'signup' ? 'Email Address' : 'Email Address or Mobile Number'}{' '}
                <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={tab === 'signup' ? 'email' : 'text'}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    tab === 'signup'
                      ? 'athlete@xclusivegym.com'
                      : 'athlete@xclusivegym.com or +15550192834'
                  }
                  className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* SIGNUP: MOBILE NUMBER (OPTIONAL) */}
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                  Mobile Phone Number <span className="text-white/30 text-[10px]">(Optional for OTP)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            )}

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                Password <span className="text-[#D4AF37]">*</span>
              </label>
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

            {/* SIGNUP: FITNESS GOAL */}
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                  Primary Fitness Goal
                </label>
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

            {/* LOGIN LINKS: REMEMBER ME & FORGOT PASSWORD */}
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
                    setOtpStep(1);
                    setRecoveryTarget(email || phone || '');
                    setErrorMsg(null);
                    setSuccessMsg(null);
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
          </form>
        )}

        {/* Social Authentication Divider */}
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
