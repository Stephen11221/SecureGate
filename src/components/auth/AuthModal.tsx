import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  RefreshCw,
  ScanFace
} from 'lucide-react';
import { User } from '../../types';
import { BiometricFaceScanner } from './BiometricFaceScanner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    isAuthenticated,
    is2FAVerified,
    pending2FA,
    inviteParam,
    login,
    signup,
    verifyOtp,
    resendOtp
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [authStep, setAuthStep] = useState<'credentials' | 'otp' | 'facescan'>('credentials');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('+254 722 890 254');
  const [loginPin, setLoginPin] = useState('••••••••');

  // Signup Form State
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [role, setRole] = useState<User['role']>('Core Security Researcher');
  const [referralCode, setReferralCode] = useState('');

  // 2FA OTP Code State (6 digits)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [savedOtp, setSavedOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Sync authStep when pending2FA changes
  useEffect(() => {
    if (pending2FA) {
      setAuthStep('otp');
    } else if (isAuthenticated && is2FAVerified) {
      setAuthStep('credentials');
    }
  }, [pending2FA, isAuthenticated, is2FAVerified]);

  // Pre-fill invite code if present in URL
  useEffect(() => {
    if (inviteParam) {
      setReferralCode(inviteParam);
      setMode('signup');
    }
  }, [inviteParam]);

  // 2FA Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pending2FA && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pending2FA, countdown]);

  if (!isOpen && (isAuthenticated && is2FAVerified)) {
    return null;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const res = await login(loginIdentifier, loginPin);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setCountdown(60);
        setAuthStep('otp');
      }
    } catch {
      setErrorMessage('Connection failed to SecureGate Auth Gateway.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!referralCode.trim()) {
      setErrorMessage('Access Denied: SecureGate requires a verified peer referral code. Registration without an invite key is restricted.');
      return;
    }

    if (!handle.trim()) {
      setErrorMessage('Please specify your specialist handle (e.g. @nairobi_sec).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signup({
        fullName: fullName.trim() || 'Kenyan Specialist',
        handle: handle.trim(),
        phone: phone.trim(),
        role,
        referralCode: referralCode.trim()
      });

      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setCountdown(60);
        setAuthStep('otp');
      }
    } catch {
      setErrorMessage('Registration handshake error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto advance to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(paste)) {
      const newDigits = paste.split('').concat(Array(6).fill('')).slice(0, 6);
      setOtpDigits(newDigits);
    }
  };

  // Step 2 -> Step 3: Validate OTP then proceed to Biometric Face Scan
  const handleVerifyOtpAndProceedToFaceScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the OTP dispatched to your Kenyan mobile.');
      return;
    }

    if (pending2FA && fullOtp !== pending2FA.generatedOtp) {
      setErrorMessage('Invalid 2FA code. Cryptographic verification failed.');
      return;
    }

    setSavedOtp(fullOtp);
    // Proceed to Biometric Face Scan & Liveness Check!
    setAuthStep('facescan');
  };

  // Step 3 Completion: Finalize authentication
  const handleFaceScanComplete = async (success: boolean, _score: number) => {
    if (!success) {
      setErrorMessage('Face scan failed or liveness check inconclusive. Please retry.');
      return;
    }

    setIsSubmitting(true);
    try {
      const otpToVerify = savedOtp || otpDigits.join('') || pending2FA?.generatedOtp || '';
      const res = await verifyOtp(otpToVerify);
      if (!res.success) {
        setErrorMessage(res.message);
        setAuthStep('otp');
      } else {
        onClose();
      }
    } catch {
      setErrorMessage('Cryptographic validation error during biometric session completion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyDemoReferral = (code: string) => {
    setReferralCode(code);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Subtle Ambient Shield Badge */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">SecureGate Access Portal</h2>
              <p className="text-xs text-slate-400">Kenya Cybersecurity & Specialist Network</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
            E2EE Zero-Trust
          </span>
        </div>

        {/* Step Indicator when in MFA flow */}
        {pending2FA && (
          <div className="mt-4 flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-3">
            <div className={`flex items-center gap-1.5 ${authStep === 'otp' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
              <Smartphone className="w-3.5 h-3.5" />
              <span>1. Phone OTP</span>
            </div>
            <div className="h-0.5 w-6 bg-slate-800" />
            <div className={`flex items-center gap-1.5 ${authStep === 'facescan' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
              <ScanFace className="w-3.5 h-3.5" />
              <span>2. Face Scan</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-950/50 border border-red-800/80 rounded-lg flex items-start gap-2 text-xs text-red-200 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* STEP 3: BIOMETRIC FACE SCAN & LIVENESS VERIFICATION */}
        {authStep === 'facescan' && pending2FA ? (
          <div className="mt-4">
            <BiometricFaceScanner
              onScanComplete={handleFaceScanComplete}
              onCancel={() => setAuthStep('otp')}
              userPhone={pending2FA.phone}
            />
          </div>
        ) : authStep === 'otp' && pending2FA ? (
          /* STEP 2: PHONE OTP VERIFICATION */
          <form onSubmit={handleVerifyOtpAndProceedToFaceScan} className="mt-6 space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">Step 1: Phone SMS OTP Verification</h3>
              <p className="mt-1 text-xs text-slate-400">
                A 6-digit one-time passkey was sent via SMS to{' '}
                <span className="font-mono text-slate-200 font-semibold">{pending2FA.phone}</span>
              </p>
              <div className="mt-2 text-[11px] text-emerald-400/90 font-mono">
                Simulation: Check top-right notification banner for code
              </div>
            </div>

            <div className="flex justify-center gap-2 my-4" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  className="w-11 h-12 text-center text-lg font-mono font-bold bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              ))}
            </div>

            {/* Helper auto-fill button for fast demo */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (pending2FA?.generatedOtp) {
                    const digits = pending2FA.generatedOtp.split('');
                    setOtpDigits(digits);
                  }
                }}
                className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                Auto-fill Code ({pending2FA.generatedOtp})
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-emerald-950 disabled:opacity-50"
            >
              <ScanFace className="w-4 h-4" />
              <span>Verify Phone OTP & Proceed to Face Scan</span>
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="font-mono tabular-nums">
                Expires in: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => {
                  resendOtp();
                  setCountdown(60);
                }}
                disabled={countdown > 30}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend SMS OTP</span>
              </button>
            </div>
          </form>
        ) : (
          /* STEP 1: CREDENTIALS & REFERRAL CODE */
          <>
            {/* Tab switch between Login and Signup */}
            <div className="mt-5 grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                  mode === 'login' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                  mode === 'signup' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Join with Referral Key
              </button>
            </div>

            {/* VIEW: LOGIN PROMPT */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Specialist Handle or Kenyan Mobile
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      placeholder="+254 7XX XXX XXX or @handle"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <UserCheck className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Hardware Passkey / PIN
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPin}
                      onChange={e => setLoginPin(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>2FA Authentication Notice</span>
                  </div>
                  Logging in requires dual verification: Kenyan Mobile Phone OTP followed by Biometric Face Scan & Liveness Check.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-emerald-950 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Validating...' : 'Continue to Phone OTP & Face Scan'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              /* VIEW: STRICT REFERRAL SIGNUP PROMPT */
              <form onSubmit={handleSignupSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Legal / Research Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Dennis Kiprono"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Cyber Handle
                    </label>
                    <input
                      type="text"
                      required
                      value={handle}
                      onChange={e => setHandle(e.target.value)}
                      placeholder="@handle"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Specialist Domain
                    </label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as User['role'])}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Core Security Researcher">Core Researcher</option>
                      <option value="Red Team Specialist">Red Team Specialist</option>
                      <option value="DFIR Analyst">DFIR Analyst</option>
                      <option value="Cryptographer">Cryptographer</option>
                      <option value="Fintech Security Architect">Fintech Security</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kenyan Mobile (For 2FA Phone OTP)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                {/* MANDATORY REFERRAL CODE FIELD */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5" />
                      <span>Peer Referral Code (Required)</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Strictly Enforced</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={referralCode}
                    onChange={e => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SEC-KE-254"
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-lg px-3 py-2 text-xs font-mono font-semibold text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />

                  {/* Pre-seeded demo codes helper */}
                  <div className="mt-2 p-2 bg-slate-950/80 border border-slate-800 rounded text-[11px] text-slate-400">
                    <span className="text-slate-300 font-medium">Valid Demo Invite Keys:</span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {['SEC-KE-254', 'NAIROBI-ROOT', 'CYBER-SAVANNAH'].map(demoCode => (
                        <button
                          key={demoCode}
                          type="button"
                          onClick={() => applyDemoReferral(demoCode)}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono rounded text-[10px] cursor-pointer transition-colors"
                        >
                          {demoCode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-emerald-950 disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Verifying Invite...' : 'Register with Referral & Get OTP'}</span>
                </button>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
};
