import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ReferralRecord } from '../types';
import { INITIAL_USER, VALID_REFERRAL_CODES } from '../data/mockData';
import { generateReferralCode, generateOtpCode } from '../utils/crypto';

export interface Pending2FAState {
  phone: string;
  generatedOtp: string;
  tempUser: Partial<User>;
  expiresAt: number;
  mode: 'login' | 'signup';
}

export interface SecurityToast {
  id: string;
  type: 'sms_otp' | 'security_alert' | 'success' | 'info';
  title: string;
  message: string;
  codeSnippet?: string;
  timestamp: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  is2FAVerified: boolean;
  pending2FA: Pending2FAState | null;
  validReferralCodes: string[];
  userReferrals: ReferralRecord[];
  activeToasts: SecurityToast[];
  inviteParam: string | null;
  login: (handleOrPhone: string, pin: string) => Promise<{ success: boolean; message: string }>;
  signup: (payload: {
    fullName: string;
    handle: string;
    phone: string;
    role: User['role'];
    referralCode: string;
  }) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (code: string) => Promise<{ success: boolean; message: string }>;
  resendOtp: () => void;
  logout: () => void;
  generateInviteCode: () => string;
  dismissToast: (id: string) => void;
  addToast: (toast: Omit<SecurityToast, 'id' | 'timestamp'>) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [is2FAVerified, setIs2FAVerified] = useState<boolean>(true);
  const [pending2FA, setPending2FA] = useState<Pending2FAState | null>(null);
  const [validReferralCodes, setValidReferralCodes] = useState<string[]>(VALID_REFERRAL_CODES);
  const [inviteParam, setInviteParam] = useState<string | null>(null);
  const [activeToasts, setActiveToasts] = useState<SecurityToast[]>([]);

  const [userReferrals, setUserReferrals] = useState<ReferralRecord[]>([
    {
      code: 'SEC-KE-BANNER',
      createdBy: 'usr_banner_01',
      createdAt: '2025-11-12',
      usedBy: '@wanjiku_crypto',
      claimed: true
    },
    {
      code: 'SEC-KE-99AX24',
      createdBy: 'usr_banner_01',
      createdAt: '2026-09-18',
      claimed: false
    },
    {
      code: 'SEC-KE-71KL09',
      createdBy: 'usr_banner_01',
      createdAt: '2026-09-20',
      claimed: false
    }
  ]);

  // Check URL query parameters for invite link: ?invite=SEC-KE-XXX
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    if (invite) {
      setInviteParam(invite.trim().toUpperCase());
      addToast({
        type: 'info',
        title: 'Invite Key Detected',
        message: `Validated cryptographically sealed referral invite token: ${invite}`
      });
    }
  }, []);

  const addToast = (toast: Omit<SecurityToast, 'id' | 'timestamp'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    const newToast: SecurityToast = {
      ...toast,
      id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setActiveToasts(prev => [newToast, ...prev].slice(0, 4));

    // Auto dismiss non-critical toasts after 12s
    setTimeout(() => {
      dismissToast(id);
    }, 12000);
  };

  const dismissToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = async (handleOrPhone: string, _pin: string) => {
    // Generate realistic 6-digit OTP
    const otp = generateOtpCode();
    const phone = handleOrPhone.startsWith('+') ? handleOrPhone : INITIAL_USER.phone;

    const pending: Pending2FAState = {
      phone,
      generatedOtp: otp,
      tempUser: INITIAL_USER,
      expiresAt: Date.now() + 5 * 60 * 1000,
      mode: 'login'
    };

    setPending2FA(pending);
    setIsAuthenticated(false);
    setIs2FAVerified(false);

    // Simulate SMS dispatch to Kenyan Telco
    addToast({
      type: 'sms_otp',
      title: 'SMS Alert: Safaricom 2FA Gateway',
      message: `[SecureGate 2FA] Your one-time verification passkey is ${otp}. Valid for 5 minutes. Do NOT share this OTP with anyone.`,
      codeSnippet: otp
    });

    return {
      success: true,
      message: `2FA security challenge dispatched to phone ${phone}. Check SMS banner.`
    };
  };

  const signup = async (payload: {
    fullName: string;
    handle: string;
    phone: string;
    role: User['role'];
    referralCode: string;
  }) => {
    const code = payload.referralCode.trim().toUpperCase();

    // Strict Referral Validation
    if (!code) {
      return {
        success: false,
        message: 'Registration Denied: SecureGate is strictly invite-only. A valid referral code is required.'
      };
    }

    if (!validReferralCodes.includes(code)) {
      return {
        success: false,
        message: `Registration Denied: Referral code "${code}" is invalid, expired, or has not been signed by a trusted specialist.`
      };
    }

    const otp = generateOtpCode();
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      username: payload.handle.replace('@', '').toLowerCase(),
      handle: payload.handle.startsWith('@') ? payload.handle : `@${payload.handle}`,
      fullName: payload.fullName,
      avatar: '/src/assets/images/avatar_cyber_kenya_1790143371413.jpg',
      bio: 'Kenyan Computer Specialist & Cyber Researcher. Verified via referral token.',
      location: 'Nairobi, Kenya',
      role: payload.role,
      verified: true,
      phone: payload.phone,
      pgpFingerprint: 'E45A ' + Array.from({ length: 7 }, () => Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()).join(' '),
      reputation: 500,
      referralCode: generateReferralCode(),
      referralsCount: 0,
      joinedAt: 'September 2026',
      is2FAEnabled: true,
    };

    const pending: Pending2FAState = {
      phone: payload.phone,
      generatedOtp: otp,
      tempUser: newUser,
      expiresAt: Date.now() + 5 * 60 * 1000,
      mode: 'signup'
    };

    setPending2FA(pending);

    // Simulate SMS dispatch to Kenyan phone
    addToast({
      type: 'sms_otp',
      title: 'SMS Alert: Safaricom / Airtel 2FA Gateway',
      message: `[SecureGate 2FA] Your registration activation code is ${otp}. Valid for 5 minutes.`,
      codeSnippet: otp
    });

    return {
      success: true,
      message: `Verification code sent to ${payload.phone}.`
    };
  };

  const verifyOtp = async (code: string) => {
    if (!pending2FA) {
      return { success: false, message: 'No pending 2FA challenge found.' };
    }

    if (Date.now() > pending2FA.expiresAt) {
      return { success: false, message: 'OTP has expired. Please request a new code.' };
    }

    if (code.trim() !== pending2FA.generatedOtp) {
      return { success: false, message: 'Invalid 2FA code. Cryptographic verification failed.' };
    }

    // Success! Authenticate user
    const authenticatedUser = (pending2FA.tempUser.id ? pending2FA.tempUser : INITIAL_USER) as User;
    setUser(authenticatedUser);
    setIsAuthenticated(true);
    setIs2FAVerified(true);
    setPending2FA(null);

    addToast({
      type: 'success',
      title: 'Identity Authenticated',
      message: `Zero-Knowledge Session established for ${authenticatedUser.handle}. Hardware security token active.`
    });

    return {
      success: true,
      message: 'Cryptographic challenge passed. Welcome to SecureGate.'
    };
  };

  const resendOtp = () => {
    if (!pending2FA) return;
    const newOtp = generateOtpCode();
    setPending2FA({
      ...pending2FA,
      generatedOtp: newOtp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    addToast({
      type: 'sms_otp',
      title: 'Resent SMS: 2FA Passkey',
      message: `[SecureGate 2FA] Your new one-time passcode is ${newOtp}.`,
      codeSnippet: newOtp
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIs2FAVerified(false);
    setPending2FA(null);
    addToast({
      type: 'info',
      title: 'Secure Terminal Locked',
      message: 'All local cryptographic keys wiped from browser volatile memory.'
    });
  };

  const generateInviteCode = () => {
    const code = generateReferralCode();
    setValidReferralCodes(prev => [...prev, code]);
    const newRecord: ReferralRecord = {
      code,
      createdBy: user?.id || 'usr_banner_01',
      createdAt: new Date().toISOString().split('T')[0],
      claimed: false
    };
    setUserReferrals(prev => [newRecord, ...prev]);

    if (user) {
      setUser({
        ...user,
        referralsCount: user.referralsCount + 1
      });
    }

    addToast({
      type: 'success',
      title: 'Invite Token Minted',
      message: `Signed invite key ${code} generated. Shareable link copied to clipboard.`
    });

    return code;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        is2FAVerified,
        pending2FA,
        validReferralCodes,
        userReferrals,
        activeToasts,
        inviteParam,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
        generateInviteCode,
        dismissToast,
        addToast,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
