import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Smartphone, ScanFace, Award, Fingerprint, X, Lock } from 'lucide-react';
import { User } from '../../types';

interface VerificationBadgeProps {
  verified?: boolean;
  level?: 'KeCERT Elite' | 'Biometric Verified' | 'Core Specialist';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  user?: Partial<User>;
  interactive?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  verified = true,
  level = 'Biometric Verified',
  size = 'sm',
  showLabel = false,
  user,
  interactive = true
}) => {
  const [showModal, setShowModal] = useState(false);

  if (!verified) return null;

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const badgeLevelColor = {
    'KeCERT Elite': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    'Biometric Verified': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    'Core Specialist': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  }[level] || 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title="Verified Specialist: Biometric & 2FA Cleared (Click to inspect certificate)"
        className={`inline-flex items-center gap-1 transition-all group ${
          interactive ? 'cursor-pointer hover:scale-105' : 'cursor-default'
        }`}
      >
        <span
          className={`inline-flex items-center justify-center rounded-full border shadow-sm ${badgeLevelColor} p-0.5`}
        >
          <ShieldCheck className={`${sizeClasses[size]} shrink-0`} />
        </span>
        {showLabel && (
          <span className="text-[10px] font-mono tracking-tight text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
            {level}
          </span>
        )}
      </button>

      {/* Verification Certificate Inspection Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 text-left"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span>Cryptographic Verification Certificate</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">KeCERT & Biometric Identity Attestation</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subject details */}
            <div className="my-4 p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Specialist:</span>
                <span className="font-semibold text-white">{user?.fullName || 'Banner Mwangi'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Handle:</span>
                <span className="font-mono text-emerald-400">{user?.handle || '@banner_sec'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Clearance Level:</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-semibold">
                  Tier-3 Verified Operator
                </span>
              </div>
            </div>

            {/* Verification Factors */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <ScanFace className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">Biometric Face Scan & Liveness</span>
                    <span className="text-[10px] font-mono text-cyan-400">99.7% Neural Match</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    128-point facial landmark vector validated against secure hardware enclave.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">Phone OTP 2FA Clearance</span>
                    <span className="text-[10px] font-mono text-emerald-400">Safaricom / Airtel</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hardware-bound mobile channel verified (+254 7XX...254).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <Fingerprint className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">Peer Referral Chain</span>
                    <span className="text-[10px] font-mono text-amber-400">Cryptographically Signed</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Vetted by senior Kenya cyber ring specialists. No unvetted bots permitted.
                  </p>
                </div>
              </div>
            </div>

            {/* Digest Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-400">
                <Lock className="w-3 h-3 text-emerald-400" />
                KeCERT Registry Seal
              </span>
              <span className="text-slate-400">SHA-256: 4f90...21c8</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
