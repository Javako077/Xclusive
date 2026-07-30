import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, ShieldCheck, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';
import { OtpBoxInput } from '../components/OtpBoxInput';

export const AdminForgotPasswordPage = () => {
  // Step 1: Enter Email
  // Step 2: Verify OTP (6 Separate Input Boxes)
  // Step 3: Reset Password (ONLY accessible after Step 2 OTP verification succeeds)
  // Step 4: Success Confirmation
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // 60-Second Countdown Timer for Resend OTP
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Step 1: Request OTP for Admin
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email || !email.trim()) {
      setError('Please enter your Admin email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessNotice(null);

    try {
      const res = await apiService.adminForgotPassword({ email: email.trim() });
      setSuccessNotice(res.message || 'Verification OTP code dispatched to your admin email address.');
      setCountdown(60); // Start 60-second countdown timer
      setStep(2);
    } catch (err) {
      console.error('Admin Forgot Password Request Error:', err);
      setError(err.message || 'Failed to request OTP for this admin email.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Click
  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    setOtp('');
    await handleRequestOtp(null);
  };

  // Step 2: Verify Admin OTP ONLY (Gates access to Step 3 Reset Password)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiService.adminVerifyOtp({
        email: email.trim(),
        otp: otp.trim(),
      });
      setIsOtpVerified(true);
      setSuccessNotice('Admin OTP verified successfully! Enter your new password below.');
      setStep(3); // Navigate to Reset Password page ONLY on success!
    } catch (err) {
      console.error('Admin OTP Verification Error:', err);
      setError(err.message || 'Invalid or expired OTP code. Please check the 6 digits and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Admin Password (Only accessible when isOtpVerified is true)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      setError('OTP verification required before resetting password.');
      setStep(2);
      return;
    }

    if (!newPassword) {
      setError('Please enter your new admin password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter passwords.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiService.adminResetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
      setStep(4); // Success step
    } catch (err) {
      console.error('Admin Reset Password Error:', err);
      setError(err.message || 'Failed to save new admin password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-950 border-2 border-[#D4AF37]/40 text-[#F5D76E] shadow-[0_0_30px_rgba(212,175,55,0.2)] mb-4">
            <KeyRound className="w-8 h-8" />
          </div>
          <div className="inline-block mb-1">
            <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-2 flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3 h-3" /> Security Credential Recovery
            </span>
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tight text-white">
            ADMIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16]">RECOVERY</span>
          </h1>
          <p className="text-xs text-white/50 mt-1">
            {step === 1 && 'Step 1 of 3: Enter registered admin email to generate a security OTP code.'}
            {step === 2 && 'Step 2 of 3: Verify the 6-digit security code sent to your email.'}
            {step === 3 && 'Step 3 of 3: Enter a new secure password for your Admin account.'}
            {step === 4 && 'Password successfully updated.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-950/90 border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-400 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success / Notice */}
          {successNotice && (step === 2 || step === 3) && (
            <div className="mb-6 p-3.5 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D76E] text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#D4AF37]" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* STEP 1: REQUEST OTP */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-5">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Dispatching OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP (6 SEPARATE INPUT BOXES) */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
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

                {/* 6 SEPARATE INPUT BOXES COMPONENT */}
                <OtpBoxInput
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    if (error) setError(null);
                  }}
                  disabled={loading}
                  error={!!error}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3.5 rounded-xl bg-black border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* STEP 3: RESET ADMIN PASSWORD (ACCESSIBLE ONLY AFTER OTP VERIFICATION SUCCEEDS) */}
          {step === 3 && isOtpVerified && (
            <form onSubmit={handleResetPassword} className="space-y-5 animate-in fade-in duration-200">
              {/* Verified Badge */}
              <div className="p-3.5 rounded-2xl bg-green-950/30 border border-green-500/30 text-green-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <span>Admin OTP Verified. Enter your new password below.</span>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  New Admin Password <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Confirm New Password <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-4 py-3.5 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 rounded-xl"
              >
                {loading ? 'Updating Password...' : 'Reset & Save Password'}
              </button>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F5D76E] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase italic">Password Successfully Updated</h2>
              <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">
                Your administrator credentials have been securely updated. You can now log into the Admin Console.
              </p>
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full py-4 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/20 rounded-xl mt-2"
              >
                Proceed to Admin Login
              </button>
            </div>
          )}

          {/* Footer Back Link */}
          {step !== 4 && (
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <Link
                to="/admin/login"
                className="text-xs text-white/60 hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
              >
                ← Back to Admin Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
