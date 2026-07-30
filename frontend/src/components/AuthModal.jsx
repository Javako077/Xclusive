import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // OTP Forgot Password State
  // otpStep 1: Enter Email/Phone
  // otpStep 2: Enter & Verify 6-digit OTP (6 Boxes)
  // otpStep 3: Reset Password (ONLY accessible after OTP verification succeeds)
  // otpStep 4: Success confirmation
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

  useEffect(() => {
    setTab(initialTab);
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpStep(1);
    setOtpCode('');
    setIsOtpVerified(false);
  }, [initialTab, isOpen]);

  // Handle 60s Resend OTP Timer
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

  // Handle Signup / Login Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === 'signup') {
        const result = await apiService.signup({
          name,
          email,
          phone,
          password,
          fitnessGoal: goal,
        });
        setSuccessMsg('Account created successfully! Welcome to Xclusive.');
        setTimeout(() => {
          onSuccess(result.user || { name, email, membershipPlan: 'VIP PRO PASS' });
        }, 800);
      } else if (tab === 'login') {
        const loggedUser = await apiService.login({
          email,
          password,
        });
        setSuccessMsg('Authentication successful!');
        setTimeout(() => {
          onSuccess(loggedUser);
        }, 500);
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setErrorMsg(err.message || 'Authentication request failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to User Email/Phone
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!recoveryTarget) {
      setErrorMsg('Please enter your registered email address or mobile number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiService.sendOtp({ recoveryTarget: recoveryTarget.trim() });
      setSuccessMsg(res.message || 'Verification OTP code dispatched to your email address.');
      setCountdown(60); // 60s countdown timer
      setOtpStep(2);
    } catch (err) {
      console.error('Send OTP Error:', err);
      setErrorMsg(err.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Click
  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    setOtpCode('');
    await handleSendOtp(null);
  };

  // Step 2: Verify OTP Only (Gates access to Step 3 Password Reset)
  const handleVerifyOtpOnly = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await apiService.verifyUserOtp({
        recoveryTarget: recoveryTarget.trim(),
        otp: otpCode.trim(),
      });
      setIsOtpVerified(true);
      setSuccessMsg('OTP verified successfully! Create your new password.');
      setOtpStep(3); // Navigate to Reset Password step ONLY on success!
    } catch (err) {
      console.error('Verify OTP Error:', err);
      setErrorMsg(err.message || 'Invalid or expired OTP code. Please check the digits and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save New Password (Only accessible when isOtpVerified is true)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      setErrorMsg('OTP verification required before resetting password.');
      setOtpStep(2);
      return;
    }

    if (!newPassword) {
      setErrorMsg('Please enter your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter passwords.');
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
      setOtpStep(4); // Success step
    } catch (err) {
      console.error('Reset Password Error:', err);
      setErrorMsg(err.message || 'Failed to save new password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider) => {
    const mockUser = {
      name: `${provider} Athlete`,
      email: `athlete.${provider.toLowerCase()}@xclusive.com`,
      membershipPlan: 'VIP PRO PASS',
      savedPlans: [],
    };
    setSuccessMsg(`Authenticated via ${provider}! Logging in...`);
    setTimeout(() => {
      onSuccess(mockUser);
    }, 600);
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
            XCLUSIVE ATHLETE PORTAL
          </h3>
          <p className="text-xs text-white/50 mt-1">
            {tab === 'signup' && 'Create your athlete account to access plans & scheduling'}
            {tab === 'login' && 'Log in with your athlete credentials'}
            {tab === 'forgot' && 'Account Recovery & Password Verification'}
          </p>
        </div>

        {/* Navigation Tabs (Signup / Login) */}
        {tab !== 'forgot' && (
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
              User Login
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37] text-[#F5D76E] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#D4AF37]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* FORGOT PASSWORD MODAL TAB (MATCHES ADMIN OTP PAGE DESIGN)  */}
        {/* ========================================================= */}
        {tab === 'forgot' ? (
          <div className="space-y-4">
            {/* STEP 1: Enter Email/Phone */}
            {otpStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                    User Email Address or Mobile <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      required
                      value={recoveryTarget}
                      onChange={(e) => setRecoveryTarget(e.target.value)}
                      placeholder="athlete@xclusivegym.com"
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10 rounded-xl"
                >
                  {loading ? (
                    <span>Dispatching OTP...</span>
                  ) : (
                    <>
                      <span>Generate Verification OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
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
                    ← Back to User Login
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Enter & Verify 6-digit OTP (6 SEPARATE INPUT BOXES) */}
            {otpStep === 2 && (
              <form onSubmit={handleVerifyOtpOnly} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                      6-Digit Verification OTP <span className="text-[#D4AF37]">*</span>
                    </label>
                    {countdown > 0 ? (
                      <span className="text-[11px] font-mono text-[#F5D76E]">
                        Resend in {countdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-xs text-[#D4AF37] hover:text-[#F5D76E] font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Resend OTP
                      </button>
                    )}
                  </div>

                  {/* 6 SEPARATE BOX INPUT COMPONENT */}
                  <OtpBoxInput
                    value={otpCode}
                    onChange={(val) => {
                      setOtpCode(val);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    disabled={loading}
                    error={!!errorMsg}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOtpStep(1)}
                    className="px-4 py-3 rounded-xl bg-black border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="flex-1 py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span>Verifying OTP...</span>
                    ) : (
                      <>
                        <span>Verify Code & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Reset Password (ONLY ACCESSIBLE AFTER OTP VERIFICATION SUCCEEDS) */}
            {otpStep === 3 && isOtpVerified && (
              <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                    New User Password <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
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

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                    Confirm New Password <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10 rounded-xl"
                >
                  {loading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            )}

            {/* STEP 4: Password Reset Success */}
            {otpStep === 4 && (
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
                  Proceed to User Login
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================= */
          /* SIGNUP / LOGIN FORMS */
          /* ========================================================= */
          <form onSubmit={handleSubmit} className="space-y-4">
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
                    onClose();
                    navigate('/forgot-password');
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
              className="w-full py-4 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{tab === 'signup' ? 'Create Athlete Account' : 'Log In to Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* SOCIAL AUTH SEPARATOR */}
        {tab !== 'forgot' && (
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
