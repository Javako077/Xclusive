import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { apiService } from '../services/api';
import { OtpBoxInput } from './OtpBoxInput';

export const AuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'signup',
}) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(initialTab); // 'signup' | 'login' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState('Muscle Building & Hypertrophy');

  // Social Auth State (Google / Apple / Strava)
  const [socialProvider, setSocialProvider] = useState(null); // 'Google' | 'Apple' | 'Strava' | null
  const [socialEmail, setSocialEmail] = useState('');
  const [socialName, setSocialName] = useState('');

  // OTP Forgot Password State
  const [otpStep, setOtpStep] = useState(1);
  const [recoveryTarget, setRecoveryTarget] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Countdown timer for Resend OTP (60s)
  const [countdown, setCountdown] = useState(0);

  // Status State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Sync tab if initialTab prop changes
  useEffect(() => {
    setTab(initialTab);
    setErrorMsg(null);
    setSuccessMsg(null);
    setSocialProvider(null);
  }, [initialTab, isOpen]);

  // Countdown Timer Effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  // Handle Standard Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields (Name, Email, Password).');
      toast.error('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const user = await apiService.signup({ name, email, phone, password, goal });
      toast.success(`Account created successfully! Welcome, ${user.name}`);
      onSuccess(user);
    } catch (err) {
      console.error('Signup Error:', err);
      setErrorMsg(err.message || 'Registration failed. Email may already be in use.');
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Standard Log In
  const handleLogIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      toast.error('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const user = await apiService.login({ email, password });
      toast.success(`Welcome back, ${user.name}!`);
      onSuccess(user);
    } catch (err) {
      console.error('Login Error:', err);
      setErrorMsg(err.message || 'Invalid credentials or suspended account.');
      toast.error(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Dispatch OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!recoveryTarget || !recoveryTarget.trim()) {
      setErrorMsg('Please enter your registered Email ID or Mobile number.');
      toast.error('Email or mobile number is required.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await apiService.sendOtp({
        recoveryTarget: recoveryTarget.trim(),
        method: recoveryTarget.includes('@') ? 'email' : 'phone',
      });

      toast.success(res.message || '6-digit Security OTP code dispatched!');
      setOtpStep(2);
      setCountdown(60); // 60 second countdown timer
    } catch (err) {
      console.error('Send OTP Error:', err);
      setErrorMsg(err.message || 'Account not found. Please verify details.');
      toast.error(err.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify 6-digit OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      toast.error('Please enter complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await apiService.verifyUserOtp({
        recoveryTarget: recoveryTarget.trim(),
        otp: otpCode.trim(),
      });

      toast.success(res.message || 'OTP code verified successfully!');
      setIsOtpVerified(true);
      setOtpStep(3); // Proceed to Step 3: Enter New Password
    } catch (err) {
      console.error('Verify OTP Error:', err);
      setErrorMsg(err.message || 'Invalid or expired OTP code.');
      toast.error(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await apiService.sendOtp({
        recoveryTarget: recoveryTarget.trim(),
        method: recoveryTarget.includes('@') ? 'email' : 'phone',
      });
      toast.success('A new 6-digit security code has been sent!');
      setCountdown(60);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend verification code.');
      toast.error('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Save New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setErrorMsg('Please enter your new password.');
      toast.error('Please enter your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter passwords.');
      toast.error('Passwords do not match. Please re-enter passwords.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await apiService.verifyOtpAndResetPassword({
        recoveryTarget: recoveryTarget.trim(),
        otp: otpCode.trim(),
        newPassword,
      });
      toast.success('Password reset successfully!');
      setOtpStep(4); // Success step
    } catch (err) {
      console.error('Reset Password Error:', err);
      setErrorMsg(err.message || 'Failed to save new password. Please try again.');
      toast.error(err.message || 'Failed to save new password.');
    } finally {
      setLoading(false);
    }
  };

  // Open Social Authentication Prompt for Google / Apple
  const handleOpenSocialAuth = (provider) => {
    setSocialProvider(provider);
    setSocialEmail('');
    setSocialName('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Handle Social Email ID Submission
  const handleSocialSubmit = async (e) => {
    e.preventDefault();

    if (!socialEmail || !socialEmail.trim() || !socialEmail.includes('@')) {
      setErrorMsg(`Please enter a valid ${socialProvider} email ID.`);
      toast.error(`Please enter a valid ${socialProvider} email ID.`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const user = await apiService.socialLogin({
        provider: socialProvider,
        email: socialEmail.trim(),
        name: socialName.trim() || socialEmail.split('@')[0].toUpperCase(),
      });

      toast.success(`Successfully signed in via ${socialProvider} as ${user.email}!`);
      onSuccess(user);
    } catch (err) {
      console.error(`${socialProvider} Auth Error:`, err);
      setErrorMsg(err.message || `Failed to authenticate via ${socialProvider}.`);
      toast.error(err.message || `Authentication failed via ${socialProvider}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-zinc-950 border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-zinc-950 border-2 border-[#D4AF37] p-1.5 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(212,175,55,0.3)] overflow-hidden">
            <img
              src="/Xclusivelogo.png"
              alt="Xclusive Gym"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h3 className="text-xl font-black italic uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16]">
            {socialProvider ? `${socialProvider.toUpperCase()} AUTHENTICATION` : 'XCLUSIVE ATHLETE PORTAL'}
          </h3>
          <p className="text-xs text-white/50 mt-1">
            {socialProvider && `Log in or sign up with your official ${socialProvider} Account`}
            {!socialProvider && tab === 'signup' && 'Create your athlete account to access plans & scheduling'}
            {!socialProvider && tab === 'login' && 'Log in with your athlete credentials'}
            {!socialProvider && tab === 'forgot' && 'Account Recovery & Password Verification'}
          </p>
        </div>

        {/* Navigation Tabs (Signup / Login) - Only when not in Social mode or Forgot mode */}
        {!socialProvider && tab !== 'forgot' && (
          <div className="flex bg-black border border-white/10 rounded-2xl p-1 mb-6">
            <button
              onClick={() => {
                setTab('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black shadow-md'
                  : 'text-white/60 hover:text-white'
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
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Log In
            </button>
          </div>
        )}

        {/* Error / Success Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* DEDICATED GOOGLE / APPLE EMAIL AUTHENTICATION PROMPT */}
        {socialProvider ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-[#D4AF37]/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center mx-auto shadow-inner">
                {socialProvider === 'Google' && (
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                {socialProvider === 'Apple' && (
                  <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.9-14.38-6.08-3.37-2.76-7.24-7.46-11.62-14.12-6.52-9.87-11.75-20.73-15.68-32.58-3.93-11.85-5.9-23.23-5.9-34.13 0-14.49 3.73-26.4 11.19-35.73 7.46-9.33 16.73-14.11 27.81-14.34 4.8 0 10.02 1.18 15.66 3.53 5.64 2.36 9.69 3.54 12.14 3.54 2.12 0 6.24-1.22 12.35-3.66 6.12-2.44 11.45-3.54 16.01-3.3 11.46.68 20.9 4.86 28.33 12.54-10.14 6.13-15.11 14.6-14.92 25.4.2 10.42 4.29 18.96 12.28 25.62 3.65 3.03 7.74 5.34 12.27 6.93-2.58 7.54-5.95 15.06-10.11 22.56zM119.22 31.95c0-6.66 2.44-13.06 7.32-19.2 4.88-6.14 11.02-9.76 18.42-10.86.13 1.01.2 1.83.2 2.47 0 6.74-2.5 13.27-7.49 19.59-4.99 6.32-11.19 9.94-18.45 10.86z"/>
                  </svg>
                )}
                {socialProvider === 'Strava' && <Sparkles className="w-6 h-6 text-[#F5D76E]" />}
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Sign in with {socialProvider}
              </h4>
              <p className="text-xs text-white/60">
                Enter your official {socialProvider} Email ID below to authenticate into Xclusive Gym.
              </p>
            </div>

            <form onSubmit={handleSocialSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  {socialProvider} Email ID <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    required
                    value={socialEmail}
                    onChange={(e) => setSocialEmail(e.target.value)}
                    placeholder={
                      socialProvider === 'Google'
                        ? 'e.g. yourname@gmail.com'
                        : socialProvider === 'Apple'
                        ? 'e.g. yourname@icloud.com'
                        : 'e.g. athlete@strava.com'
                    }
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={socialName}
                    onChange={(e) => setSocialName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSocialProvider(null)}
                  className="px-4 py-3 bg-black border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl"
                >
                  {loading ? 'Authenticating...' : `Continue with ${socialProvider}`}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>
        ) : tab === 'forgot' ? (
          /* FORGOT PASSWORD STEP FLOW (OTP SECURITY CODE) */
          <div>
            {/* Step 1: Input Email/Phone */}
            {otpStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Email Address or Phone <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      required
                      value={recoveryTarget}
                      onChange={(e) => setRecoveryTarget(e.target.value)}
                      placeholder="Enter registered email or phone"
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl"
                >
                  {loading ? 'Sending Code...' : 'Send Verification OTP'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}

            {/* Step 2: 6-Box OTP Code Verification */}
            {otpStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <p className="text-[11px] text-white/50 mb-3">
                    Dispatched to <span className="text-[#F5D76E] font-bold">{recoveryTarget}</span>
                  </p>

                  <OtpBoxInput value={otpCode} onChange={(val) => setOtpCode(val)} />
                </div>

                <div className="flex items-center justify-between text-xs text-white/60 pt-1">
                  <button
                    type="button"
                    disabled={countdown > 0 || loading}
                    onClick={handleResendOtp}
                    className={`font-bold flex items-center gap-1.5 cursor-pointer ${
                      countdown > 0 ? 'text-white/30 cursor-not-allowed' : 'text-[#D4AF37] hover:underline'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    {countdown > 0 ? `Resend Code (${countdown}s)` : 'Resend Code'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep(1);
                      setOtpCode('');
                    }}
                    className="text-white/40 hover:text-white underline text-[11px]"
                  >
                    Change Identifier
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl"
                >
                  {loading ? 'Verifying...' : 'Verify OTP Code'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}

            {/* Step 3: Set New Password (Gated strictly by valid OTP verification) */}
            {otpStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>OTP Verified! Set your new password below.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    New Password <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-10 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Confirm New Password <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-10 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl"
                >
                  {loading ? 'Updating Password...' : 'Save New Password'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}

            {/* Step 4: Reset Success Confirmation */}
            {otpStep === 4 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">Password Reset Complete</h4>
                <p className="text-xs text-white/60">
                  Your security password has been updated. You can now log in with your new credentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setOtpStep(1);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all cursor-pointer"
                >
                  Proceed to Login →
                </button>
              </div>
            )}

            {otpStep !== 4 && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setOtpStep(1);
                    setErrorMsg(null);
                  }}
                  className="text-xs text-white/40 hover:text-white underline cursor-pointer"
                >
                  ← Back to Login
                </button>
              </div>
            )}
          </div>
        ) : (
          /* STANDARD SIGN UP / LOG IN FORMS */
          <form onSubmit={tab === 'signup' ? handleSignUp : handleLogIn} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Email Address <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                  Password <span className="text-[#D4AF37]">*</span>
                </label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{tab === 'signup' ? 'Create Athlete Account' : 'Log In to Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* SOCIAL AUTH SEPARATOR & BUTTONS */}
        {!socialProvider && tab !== 'forgot' && (
          <>
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-zinc-950 text-[10px] text-white/40 uppercase font-bold tracking-widest">
                Or Continue With
              </span>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleOpenSocialAuth('Google')}
                className="py-2.5 bg-black border border-white/10 rounded-xl text-xs font-bold text-white/80 hover:text-white hover:border-[#D4AF37]/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleOpenSocialAuth('Apple')}
                className="py-2.5 bg-black border border-white/10 rounded-xl text-xs font-bold text-white/80 hover:text-white hover:border-[#D4AF37]/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 fill-current text-white shrink-0" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.9-14.38-6.08-3.37-2.76-7.24-7.46-11.62-14.12-6.52-9.87-11.75-20.73-15.68-32.58-3.93-11.85-5.9-23.23-5.9-34.13 0-14.49 3.73-26.4 11.19-35.73 7.46-9.33 16.73-14.11 27.81-14.34 4.8 0 10.02 1.18 15.66 3.53 5.64 2.36 9.69 3.54 12.14 3.54 2.12 0 6.24-1.22 12.35-3.66 6.12-2.44 11.45-3.54 16.01-3.3 11.46.68 20.9 4.86 28.33 12.54-10.14 6.13-15.11 14.6-14.92 25.4.2 10.42 4.29 18.96 12.28 25.62 3.65 3.03 7.74 5.34 12.27 6.93-2.58 7.54-5.95 15.06-10.11 22.56zM119.22 31.95c0-6.66 2.44-13.06 7.32-19.2 4.88-6.14 11.02-9.76 18.42-10.86.13 1.01.2 1.83.2 2.47 0 6.74-2.5 13.27-7.49 19.59-4.99 6.32-11.19 9.94-18.45 10.86z"/>
                </svg>
                Apple
              </button>
              <button
                type="button"
                onClick={() => handleOpenSocialAuth('Strava')}
                className="py-2.5 bg-black border border-white/10 rounded-xl text-xs font-bold text-[#F5D76E] hover:border-[#D4AF37]/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                Strava
              </button>
            </div>
          </>
        )}

        {/* Admin Portal Redirect Link */}
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/40">
            Gym Administrator?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/admin/login');
              }}
              className="text-[#D4AF37] hover:text-[#F5D76E] font-bold underline transition-colors cursor-pointer inline-flex items-center gap-1 ml-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              Admin Login →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
