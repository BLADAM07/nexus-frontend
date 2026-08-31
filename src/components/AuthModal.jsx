import React, { useState, useEffect } from 'react';
import { api } from '../api';

const checkPasswordRules = (pw) => {
  if (!pw) {
    return {
      hasMinLen: false,
      hasUpper: false,
      hasLower: false,
      hasNum: false,
      hasSpec: false,
      noSequential: false,
      isValid: false
    };
  }

  const hasMinLen = pw.length >= 6;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNum = /[0-9]/.test(pw);
  const hasSpec = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pw);

  // Check sequential & repeated patterns (e.g. 123, abc, 321, cba, aaa, 111)
  let hasSequential = false;
  const lower = pw.toLowerCase();
  for (let i = 0; i < lower.length - 2; i++) {
    const c1 = lower.charCodeAt(i);
    const c2 = lower.charCodeAt(i + 1);
    const c3 = lower.charCodeAt(i + 2);

    // Consecutive numbers (0-9)
    if (lower[i] >= '0' && lower[i] <= '9' && lower[i+1] >= '0' && lower[i+1] <= '9' && lower[i+2] >= '0' && lower[i+2] <= '9') {
      if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
        hasSequential = true;
        break;
      }
    }

    // Consecutive letters (a-z)
    if (lower[i] >= 'a' && lower[i] <= 'z' && lower[i+1] >= 'a' && lower[i+1] <= 'z' && lower[i+2] >= 'a' && lower[i+2] <= 'z') {
      if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
        hasSequential = true;
        break;
      }
    }

    // Repeated characters (aaa, 111, ###)
    if (lower[i] === lower[i+1] && lower[i+1] === lower[i+2]) {
      hasSequential = true;
      break;
    }
  }

  return {
    hasMinLen,
    hasUpper,
    hasLower,
    hasNum,
    hasSpec,
    noSequential: !hasSequential,
    isValid: hasMinLen && hasUpper && hasLower && hasNum && hasSpec && !hasSequential
  };
};

export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  if (!isOpen) return null;

  // 'login' | 'register' | 'forgot-password'
  const [mode, setMode] = useState('login'); 
  const [regStep, setRegStep] = useState('form'); // 'form', 'otp', 'success'
  const [resetStep, setResetStep] = useState('email'); // 'email', 'otp-password', 'success'

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes

  // Live password validation
  const pwRules = checkPasswordRules(password);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    const isOtpActive = (mode === 'register' && regStep === 'otp') || (mode === 'forgot-password' && resetStep === 'otp-password');
    if (isOtpActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, regStep, resetStep, timerSeconds]);

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Reset modal state
  const resetForm = () => {
    setError('');
    setSuccessMsg('');
    setOtp('');
    setPassword('');
    setConfirmPassword('');
    setLoading(false);
  };

  // 1. Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(username, password);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your username/password.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Send Registration OTP (Step 1)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!pwRules.isValid) {
      setError('Please satisfy all password security rules before proceeding.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.sendOtp(username, email, password);
      setSuccessMsg(res.message || `Verification code sent to ${email}`);
      setRegStep('otp');
      setTimerSeconds(res.expires_in || 600);
    } catch (err) {
      setError(err.message || 'Failed to send verification code to this email.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Verify OTP & Register (Step 2)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code from your Gmail inbox.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.verifyOtpRegister(email, otp.trim());
      setSuccessMsg(res.message || 'Account verified successfully! Welcome email sent.');
      setRegStep('success');
      setTimeout(() => {
        onLogin && onLogin(username, password).catch(() => {});
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.message || 'Incorrect verification code. Please check your Gmail inbox.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Resend OTP (Registration)
  const handleResendOtp = async () => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await api.resendOtp(email);
      setSuccessMsg(res.message || 'A new verification code has been sent to your Gmail.');
      setTimerSeconds(600);
    } catch (err) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Send Password Reset OTP
  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await api.sendResetOtp(email.trim());
      setSuccessMsg(res.message || `Password reset code sent to ${email}`);
      setResetStep('otp-password');
      setTimerSeconds(res.expires_in || 600);
    } catch (err) {
      setError(err.message || 'Failed to send password reset code.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Handle Verify OTP & Update Password
  const handleVerifyResetPassword = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length < 6) {
      setError('Please enter the 6-digit OTP code sent to your Gmail.');
      return;
    }
    if (!pwRules.isValid) {
      setError('New password must satisfy all security rules.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your new password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await api.verifyResetPassword(email.trim(), otp.trim(), password);
      setSuccessMsg(res.message || 'Password changed successfully!');
      setResetStep('success');
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please check your OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#141416] border border-[#333338] max-w-md w-full p-6 sm:p-8 relative shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg w-8 h-8 flex items-center justify-center rounded-full bg-[#1c1c20]"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <img
              src="/images/logo/mcoc_nexus.png"
              alt="MCOC NEXUS"
              className="w-8 h-8 object-contain rounded-full shadow-[0_0_8px_rgba(225,255,0,0.4)]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/logo.png";
              }}
            />
            <span className="text-xs font-black text-brand-yellow uppercase tracking-widest">
              MCOC NEXUS
            </span>
          </div>
          
          <h3 className="text-2xl font-extrabold tracking-wider text-white">
            {mode === 'login'
              ? 'SUMMONER LOGIN'
              : mode === 'register'
              ? 'CREATE SUMMONER ACCOUNT'
              : 'RESET PASSWORD'}
          </h3>
          <p className="text-xs text-gray-400 font-inter mt-1">
            {mode === 'login'
              ? 'Enter your credentials to access your roster & upgrade cart'
              : mode === 'register'
              ? regStep === 'otp'
                ? 'Enter the 6-digit code sent from mcocnexusteam@gmail.com'
                : 'Register with verified email to receive custom coach rankup plans'
              : resetStep === 'otp-password'
              ? 'Enter OTP from your Gmail and choose your new secure password'
              : 'Enter your registered Gmail address to receive a secure 6-digit reset code'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot-password' && regStep !== 'otp' && regStep !== 'success' && (
          <div className="flex border-b border-[#25252c] mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); resetForm(); }}
              className={`flex-1 py-2.5 text-xs font-bold tracking-wider transition-colors ${
                mode === 'login'
                  ? 'border-b-2 border-brand-yellow text-brand-yellow font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setRegStep('form'); resetForm(); }}
              className={`flex-1 py-2.5 text-xs font-bold tracking-wider transition-colors ${
                mode === 'register'
                  ? 'border-b-2 border-brand-yellow text-brand-yellow font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              REGISTER
            </button>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="bg-red-950/80 border border-red-500 text-red-300 text-xs p-3 mb-4 font-inter flex items-start space-x-2">
            <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-400 flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-950/80 border border-green-500 text-green-300 text-xs p-3 mb-4 font-inter flex items-start space-x-2">
            <i className="fa-solid fa-circle-check mt-0.5 text-green-400 flex-shrink-0"></i>
            <span>{successMsg}</span>
          </div>
        )}

        {/* ----------------- 1. MODE: LOGIN ----------------- */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                USERNAME OR EMAIL:
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. BL_ADAM_07 or your@gmail.com"
                className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-300">
                  PASSWORD:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot-password');
                    setResetStep('email');
                    resetForm();
                  }}
                  className="text-[11px] text-brand-yellow hover:underline font-inter"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-yellow text-brand-dark font-extrabold py-3 text-xs tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN TO NEXUS'}
            </button>
          </form>
        )}

        {/* ----------------- 2. MODE: REGISTER (STEP 1 - FORM) ----------------- */}
        {mode === 'register' && regStep === 'form' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                SUMMONER USERNAME:
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. MasterSummoner"
                className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-300">
                  EMAIL ADDRESS:
                </label>
                <span className="text-[10px] text-green-400 font-inter flex items-center gap-1">
                  <i className="fa-solid fa-shield-halved"></i>
                  Live Email OTP
                </span>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.real.email@gmail.com"
                className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
              />
              <p className="text-[10px] text-gray-500 font-inter mt-1">
                A 6-digit OTP code will be sent to your real inbox from <strong className="text-gray-300">mcocnexusteam@gmail.com</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                CHOOSE SECURE PASSWORD:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong password"
                className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
              />

              {/* Live Password Rules Checklist */}
              {password.length > 0 && (
                <div className="mt-2.5 bg-[#17171d] border border-[#2c2c36] p-2.5 rounded-sm space-y-1 text-[11px] font-inter">
                  <div className="text-gray-400 font-bold uppercase text-[9px] mb-1">PASSWORD SECURITY RULES:</div>
                  <div className={`flex items-center gap-1.5 ${pwRules.hasMinLen ? 'text-green-400' : 'text-gray-500'}`}>
                    <i className={`fa-solid ${pwRules.hasMinLen ? 'fa-check' : 'fa-circle-xmark'} text-[10px]`}></i>
                    <span>Minimum 6 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwRules.hasUpper ? 'text-green-400' : 'text-gray-500'}`}>
                    <i className={`fa-solid ${pwRules.hasUpper ? 'fa-check' : 'fa-circle-xmark'} text-[10px]`}></i>
                    <span>At least 1 Capital letter (e.g. A, B, C)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwRules.hasLower ? 'text-green-400' : 'text-gray-500'}`}>
                    <i className={`fa-solid ${pwRules.hasLower ? 'fa-check' : 'fa-circle-xmark'} text-[10px]`}></i>
                    <span>At least 1 Small letter (e.g. a, b, c)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwRules.hasNum ? 'text-green-400' : 'text-gray-500'}`}>
                    <i className={`fa-solid ${pwRules.hasNum ? 'fa-check' : 'fa-circle-xmark'} text-[10px]`}></i>
                    <span>At least 1 Numeric value (e.g. 1, 2, 3)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwRules.hasSpec ? 'text-green-400' : 'text-gray-500'}`}>
                    <i className={`fa-solid ${pwRules.hasSpec ? 'fa-check' : 'fa-circle-xmark'} text-[10px]`}></i>
                    <span>At least 1 Special character (#, @, $, !, %, &)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwRules.noSequential ? 'text-green-400' : 'text-red-400'}`}>
                    <i className={`fa-solid ${pwRules.noSequential ? 'fa-check' : 'fa-ban'} text-[10px]`}></i>
                    <span>No sequential patterns ('123', 'abc', 'aaa')</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !pwRules.isValid}
              className="w-full bg-brand-yellow text-brand-dark font-extrabold py-3 text-xs tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>SENDING VERIFICATION CODE TO GMAIL...</span>
              ) : (
                <>
                  <i className="fa-solid fa-envelope"></i>
                  <span>SEND 6-DIGIT OTP CODE</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ----------------- 2. MODE: REGISTER (STEP 2 - OTP) ----------------- */}
        {mode === 'register' && regStep === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-[#181820] border border-[#2c2c36] p-4 text-center">
              <span className="text-[11px] text-gray-400 font-inter block mb-1">
                Sent from <strong className="text-brand-yellow">mcocnexusteam@gmail.com</strong> to:
              </span>
              <span className="text-xs font-bold text-white font-mono bg-[#111114] px-2.5 py-1 border border-[#333]">
                {email}
              </span>
              <div className="mt-2 text-[11px] text-yellow-400 font-inter">
                ⏳ Code expires in: <strong className="font-mono">{formatTimer(timerSeconds)}</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 text-center">
                ENTER 6-DIGIT OTP CODE FROM YOUR GMAIL:
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-[#1c1c20] border-2 border-brand-yellow px-4 py-3 text-2xl text-center text-brand-yellow font-black tracking-[10px] focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 font-mono"
                autoFocus
              />
              <p className="text-[10px] text-gray-400 text-center font-inter mt-1.5">
                Please check your Gmail inbox (or Spam folder) for the verification code.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-brand-yellow text-brand-dark font-extrabold py-3 text-xs tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>VERIFYING CODE...</span>
              ) : (
                <>
                  <i className="fa-solid fa-shield-check"></i>
                  <span>VERIFY & ACTIVATE ACCOUNT</span>
                </>
              )}
            </button>

            <div className="flex justify-between items-center text-xs font-inter pt-2 border-t border-[#222228]">
              <button
                type="button"
                onClick={() => { setRegStep('form'); setError(''); }}
                className="text-gray-400 hover:text-white underline"
              >
                ← Edit email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || timerSeconds > 540}
                className="text-brand-yellow hover:underline disabled:text-gray-600 disabled:no-underline"
              >
                {loading ? 'Resending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {/* ----------------- 2. MODE: REGISTER (STEP 3 - SUCCESS) ----------------- */}
        {mode === 'register' && regStep === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto text-green-400 text-2xl">
              <i className="fa-solid fa-check"></i>
            </div>
            <h4 className="text-xl font-extrabold text-white">ACCOUNT VERIFIED!</h4>
            <p className="text-xs text-gray-300 font-inter leading-relaxed">
              Welcome to MCOC NEXUS, <strong className="text-brand-yellow">{username}</strong>!<br />
              A welcoming email has been sent to <strong className="text-white">{email}</strong> from <strong className="text-brand-yellow">mcocnexusteam@gmail.com</strong>.
            </p>
            <div className="text-[11px] text-gray-500 font-inter">
              Logging you into the Nexus...
            </div>
          </div>
        )}

        {/* ----------------- 3. MODE: FORGOT PASSWORD (STEP 1 - EMAIL) ----------------- */}
        {mode === 'forgot-password' && resetStep === 'email' && (
          <form onSubmit={handleSendResetOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                REGISTERED GMAIL ADDRESS:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.registered.email@gmail.com"
                className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
                autoFocus
              />
              <p className="text-[10px] text-gray-500 font-inter mt-1">
                We will send a 6-digit password reset OTP to this Gmail address from <strong className="text-gray-300">mcocnexusteam@gmail.com</strong>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-brand-yellow text-brand-dark font-extrabold py-3 text-xs tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>SENDING RESET CODE...</span>
              ) : (
                <>
                  <i className="fa-solid fa-key"></i>
                  <span>SEND PASSWORD RESET OTP</span>
                </>
              )}
            </button>

            <div className="text-center pt-2 border-t border-[#222228]">
              <button
                type="button"
                onClick={() => { setMode('login'); resetForm(); }}
                className="text-xs text-gray-400 hover:text-white underline font-inter"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* ----------------- 3. MODE: FORGOT PASSWORD (STEP 2 - OTP & NEW PASSWORD) ----------------- */}
        {mode === 'forgot-password' && resetStep === 'otp-password' && (
          <form onSubmit={handleVerifyResetPassword} className="space-y-4">
            <div className="bg-[#181820] border border-[#2c2c36] p-3 text-center">
              <span className="text-[11px] text-gray-400 font-inter block mb-1">
                Reset code dispatched to:
              </span>
              <span className="text-xs font-bold text-white font-mono bg-[#111114] px-2.5 py-1 border border-[#333]">
                {email}
              </span>
              <div className="mt-1.5 text-[11px] text-yellow-400 font-inter">
                ⏳ Code expires in: <strong className="font-mono">{formatTimer(timerSeconds)}</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                ENTER 6-DIGIT OTP CODE:
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-[#1c1c20] border border-brand-yellow px-3 py-2 text-lg text-center text-brand-yellow font-black tracking-[8px] focus:outline-none font-mono"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                NEW SECURE PASSWORD:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
              />

              {/* Password Rules Checklist */}
              {password.length > 0 && (
                <div className="mt-2 bg-[#17171d] border border-[#2c2c36] p-2.5 rounded-sm space-y-1 text-[11px] font-inter">
                  <div className="text-gray-400 font-bold uppercase text-[9px] mb-1">PASSWORD SECURITY RULES:</div>
                  <div className={`flex items-center gap-1.5 ${pwRules.hasMinLen ? 'text-green-400' : 'text-gray-500'}`}>
                    <i className={`fa-solid ${pwRules.hasMinLen ? 'fa-check' : 'fa-circle-xmark'} text-[10px]`}></i>
                    <span>Minimum 6 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwRules.hasUpper ? 'text-green-400' : 'text-gray-500'}`}>
                    <i className={`fa-solid ${pwRules.hasUpper ? 'fa-check' : 'fa-circle-xmark'} text-[10px]`}></i>
                    <span>At least 1 Capital letter ('AAA')</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwRules.hasLower ? 'text-green-400' : 'text-gray-500'}`}>
                    <i className={`fa-solid ${pwRules.hasLower ? 'fa-check' : 'fa-circle-xmark'} text-[10px]`}></i>
                    <span>At least 1 Small letter ('aaa')</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwRules.hasNum ? 'text-green-400' : 'text-gray-500'}`}>
                    <i className={`fa-solid ${pwRules.hasNum ? 'fa-check' : 'fa-circle-xmark'} text-[10px]`}></i>
                    <span>At least 1 Numeric digit ('111')</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwRules.hasSpec ? 'text-green-400' : 'text-gray-500'}`}>
                    <i className={`fa-solid ${pwRules.hasSpec ? 'fa-check' : 'fa-circle-xmark'} text-[10px]`}></i>
                    <span>At least 1 Special character ('#', '@', '$')</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${pwRules.noSequential ? 'text-green-400' : 'text-red-400'}`}>
                    <i className={`fa-solid ${pwRules.noSequential ? 'fa-check' : 'fa-ban'} text-[10px]`}></i>
                    <span>No sequential patterns ('123', 'abc', 'aaa')</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                CONFIRM NEW PASSWORD:
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full bg-[#1c1c20] border border-[#333] px-3 py-2 text-xs text-white focus:border-brand-yellow focus:outline-none"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[10px] text-red-400 font-inter mt-1">
                  Passwords do not match.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6 || !pwRules.isValid || password !== confirmPassword}
              className="w-full bg-brand-yellow text-brand-dark font-extrabold py-3 text-xs tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>UPDATING PASSWORD...</span>
              ) : (
                <>
                  <i className="fa-solid fa-lock"></i>
                  <span>VERIFY OTP & UPDATE PASSWORD</span>
                </>
              )}
            </button>

            <div className="flex justify-between items-center text-xs font-inter pt-2 border-t border-[#222228]">
              <button
                type="button"
                onClick={() => { setResetStep('email'); setError(''); }}
                className="text-gray-400 hover:text-white underline"
              >
                ← Change email
              </button>

              <button
                type="button"
                onClick={handleSendResetOtp}
                disabled={loading || timerSeconds > 540}
                className="text-brand-yellow hover:underline disabled:text-gray-600 disabled:no-underline"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* ----------------- 3. MODE: FORGOT PASSWORD (STEP 3 - SUCCESS) ----------------- */}
        {mode === 'forgot-password' && resetStep === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto text-green-400 text-2xl">
              <i className="fa-solid fa-shield-check"></i>
            </div>
            <h4 className="text-xl font-extrabold text-white">PASSWORD UPDATED!</h4>
            <p className="text-xs text-gray-300 font-inter leading-relaxed">
              Your password has been successfully reset and updated.<br />
              A security notification was sent to <strong className="text-white">{email}</strong> from <strong className="text-brand-yellow">mcocnexusteam@gmail.com</strong>.
            </p>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                resetForm();
              }}
              className="w-full bg-brand-yellow text-brand-dark font-extrabold py-3 text-xs tracking-wider hover:bg-yellow-300 transition-colors mt-4"
            >
              PROCEED TO SIGN IN
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
