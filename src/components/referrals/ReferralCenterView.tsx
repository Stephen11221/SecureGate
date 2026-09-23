import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Share2,
  Key,
  ShieldAlert,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  PlusCircle,
  ExternalLink
} from 'lucide-react';

export const ReferralCenterView: React.FC = () => {
  const { user, userReferrals, generateInviteCode, addToast } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    const inviteUrl = `${window.location.origin}/?invite=${code}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);

    addToast({
      type: 'success',
      title: 'Invite Link Copied',
      message: `Shareable link: ${inviteUrl}`
    });
  };

  const handleCopyRaw = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code + '_raw');
    setTimeout(() => setCopiedCode(null), 2500);

    addToast({
      type: 'info',
      title: 'Referral Token Copied',
      message: `Token: ${code}`
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Share2 className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">Peer Referral & Ring Invitation Center</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            SecureGate is strictly invite-only. New specialists must possess an authorized referral token or sealed invite link.
          </p>
        </div>

        <button
          onClick={generateInviteCode}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm shadow-emerald-950"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Mint New Referral Key</span>
        </button>
      </div>

      {/* Primary Security Policy Box */}
      <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl flex items-start gap-3 text-xs text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-amber-300">Access Control Mandate</div>
          <p className="text-amber-200/90 leading-relaxed font-sans">
            To prevent unsolicited bots, unauthorized crawlers, and unvetted actors from accessing Kenyan cyber threat intelligence, all signups without a cryptographically valid referral code are automatically blocked by the gatekeeper gateway. You are responsible for the actions of peers you invite.
          </p>
        </div>
      </div>

      {/* Your Primary Referral Link */}
      {user && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-2">
            Your Permanent Specialist Invite Link
          </h3>
          <p className="text-xs text-slate-400 mb-3 font-sans">
            Share this link with trusted cybersecurity researchers or computer specialists in Kenya. The referral code will be automatically injected into their registration prompt.
          </p>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs">
            <span className="flex-1 text-emerald-400 truncate px-2 select-all">
              {`${window.location.origin}/?invite=${user.referralCode}`}
            </span>
            <button
              onClick={() => handleCopy(user.referralCode)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
            >
              {copiedCode === user.referralCode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Invite Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Referral Keys Registry Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Your Minted Invite Keys</h3>
            <p className="text-xs text-slate-400">Track tokens generated from your cryptographic profile</p>
          </div>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {userReferrals.length} keys total
          </span>
        </div>

        <div className="divide-y divide-slate-800/60 font-mono text-xs">
          {userReferrals.map(record => (
            <div
              key={record.code}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-sm tracking-wide">{record.code}</span>
                  {record.claimed ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Claimed by {record.usedBy}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 bg-amber-950 border border-amber-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Unused / Available</span>
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  Minted on {record.createdAt} · One-time peer onboarding
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyRaw(record.code)}
                  className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[11px] cursor-pointer transition-colors"
                  title="Copy token only"
                >
                  {copiedCode === record.code + '_raw' ? 'Token Copied' : 'Copy Code'}
                </button>

                <button
                  onClick={() => handleCopy(record.code)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Full Link</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
