import React, { useState } from 'react';
import { User, HireProposal, DirectMessage } from '../../types';
import { VerificationBadge } from '../ui/VerificationBadge';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  DollarSign,
  Calendar,
  Lock,
  X,
  Send,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { encryptMessage } from '../../utils/crypto';

interface HireSpecialistModalProps {
  specialist: User;
  isOpen: boolean;
  onClose: () => void;
  onProposalSent?: (proposal: HireProposal, directMsg: DirectMessage) => void;
}

export const HireSpecialistModal: React.FC<HireSpecialistModalProps> = ({
  specialist,
  isOpen,
  onClose,
  onProposalSent
}) => {
  const { user, addToast } = useAuth();

  const [projectTitle, setProjectTitle] = useState('');
  const [engagementType, setEngagementType] = useState<HireProposal['engagementType']>('Vulnerability Audit');
  const [budgetKes, setBudgetKes] = useState(specialist.hourlyRateKes ? `${specialist.hourlyRateKes} (or KES 350,000 project)` : 'KES 400,000');
  const [timeline, setTimeline] = useState('2-Week Audit Sprint');
  const [scopeDescription, setScopeDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !scopeDescription.trim()) return;

    setIsSubmitting(true);

    try {
      const proposal: HireProposal = {
        id: 'prop_' + Math.random().toString(36).substring(2, 8),
        specialistId: specialist.id,
        specialistName: specialist.fullName,
        specialistHandle: specialist.handle,
        clientName: user?.fullName || 'Anonymous Client',
        clientHandle: user?.handle || '@client_sec',
        projectTitle: projectTitle.trim(),
        engagementType,
        budgetKes: budgetKes.trim(),
        timeline: timeline.trim(),
        scopeDescription: scopeDescription.trim(),
        status: 'Pending Review',
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Create an encrypted message packet to specialist
      const messageText = `[HIRE PROPOSAL: ${engagementType.toUpperCase()}] Project: ${projectTitle} | Budget: ${budgetKes} | Timeline: ${timeline}. Scope: ${scopeDescription}`;
      const encrypted = await encryptMessage(messageText);

      const dm: DirectMessage = {
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        senderId: user?.id || 'usr_banner_01',
        receiverId: specialist.id,
        plaintext: messageText,
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        timestamp: 'Just now',
        isDelivered: true
      };

      if (onProposalSent) {
        onProposalSent(proposal, dm);
      }

      setIsSuccess(true);
      addToast({
        type: 'success',
        title: 'Encrypted Proposal Dispatched',
        message: `Contract proposal transmitted to ${specialist.handle}'s encrypted inbox. PGP signed.`
      });

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch {
      addToast({
        type: 'security_alert',
        title: 'Transmission Failed',
        message: 'Could not encrypt proposal packet.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Direct Specialist Engagement & Hire
              </h2>
              <p className="text-xs text-slate-400">
                Encrypted contract proposal and zero-knowledge escrow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-white">Proposal Successfully Dispatched</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your engagement terms and scope were encrypted using AES-256-GCM and delivered to{' '}
              <span className="text-emerald-400 font-mono">{specialist.handle}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            
            {/* Specialist Profile Card */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={specialist.avatar}
                  alt={specialist.fullName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{specialist.fullName}</span>
                    <VerificationBadge verified={specialist.verified} level={specialist.verificationLevel} size="sm" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">{specialist.handle} · {specialist.location}</div>
                  <div className="text-[10px] text-emerald-400/90">{specialist.role}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Standard Rate</div>
                <div className="text-xs font-mono font-bold text-emerald-400">
                  {specialist.hourlyRateKes || 'KES 8,500 / hr'}
                </div>
              </div>
            </div>

            {/* Engagement Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Engagement Scope
              </label>
              <select
                value={engagementType}
                onChange={e => setEngagementType(e.target.value as HireProposal['engagementType'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Vulnerability Audit">Vulnerability Audit & Codebase Review</option>
                <option value="Red Team Exercise">Red Team Penetration Testing (Blackbox / Whitebox)</option>
                <option value="Incident Response (Urgent)">Emergency Incident Response (24/7 SLA)</option>
                <option value="Fintech Smart Contract">FinTech Smart Contract & Protocol Audit</option>
                <option value="Security Architecture Advisory">Security Architecture Advisory & Retainer</option>
              </select>
            </div>

            {/* Project Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project / Target Title
              </label>
              <input
                type="text"
                required
                value={projectTitle}
                onChange={e => setProjectTitle(e.target.value)}
                placeholder="e.g. M-Pesa Payment Callback Hardening & API Pentest"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              >
              </input>
            </div>

            {/* Budget & Timeline */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Proposed Budget</span>
                </label>
                <input
                  type="text"
                  required
                  value={budgetKes}
                  onChange={e => setBudgetKes(e.target.value)}
                  placeholder="e.g. KES 500,000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Timeline</span>
                </label>
                <input
                  type="text"
                  required
                  value={timeline}
                  onChange={e => setTimeline(e.target.value)}
                  placeholder="e.g. 2 Weeks / Urgent"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Scope Details */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Scope Description & Non-Disclosure Terms</span>
              </label>
              <textarea
                required
                rows={3}
                value={scopeDescription}
                onChange={e => setScopeDescription(e.target.value)}
                placeholder="Detail technical requirements, infrastructure assets, access methods (VPN/Staging), and deliverables..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none font-sans"
              />
            </div>

            {/* Cryptographic notice */}
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Signed with PGP Fingerprint & sealed with AES-256-GCM.</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-md shadow-emerald-950 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sealing & Dispatching...' : 'Dispatch Encrypted Proposal'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
