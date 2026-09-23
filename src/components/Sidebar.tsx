import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Rss,
  MessageSquareLock,
  Flag,
  Code2,
  Users,
  Briefcase,
  Share2,
  Radio,
  Lock,
  DollarSign
} from 'lucide-react';
import { VerificationBadge } from './ui/VerificationBadge';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenHireModal?: () => void;
  onTriggerSecretAdmin?: () => void;
}

interface NavItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenHireModal,
  onTriggerSecretAdmin
}) => {
  const { user } = useAuth();

  // Purely clean public navigation — NO visible admin buttons or links
  const navigation: NavItem[] = [
    { id: 'feed', name: 'Cyber Feed', icon: Rss, badge: 'Live' },
    { id: 'jobs', name: 'Job Board', icon: Briefcase, badge: 'Open' },
    { id: 'comms', name: 'Encrypted Inbox', icon: MessageSquareLock, badge: 'E2EE' },
    { id: 'challenges', name: 'Challenge Boards', icon: Flag, count: 5 },
    { id: 'codevault', name: 'Code Vault', icon: Code2, count: 3 },
    { id: 'forums', name: 'Collaborative Forums', icon: Users },
    { id: 'referrals', name: 'Invite Center', icon: Share2 }
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-slate-800/80 bg-slate-950/70 p-4 min-h-[calc(100vh-4rem)]">
      {/* User profile compact badge with Verification Badge */}
      {user && (
        <div className="mb-5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.fullName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-100 truncate flex items-center gap-1">
                <span>{user.fullName}</span>
                <VerificationBadge
                  verified={user.verified}
                  level={user.verificationLevel}
                  size="sm"
                  user={user}
                />
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate">{user.handle}</div>
              <div className="text-[10px] text-emerald-400/90 truncate">{user.role}</div>
            </div>
          </div>

          {/* Verification Badge Status Display */}
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">Badge Tier:</span>
            <VerificationBadge
              verified={user.verified}
              level={user.verificationLevel}
              size="sm"
              showLabel
              user={user}
            />
          </div>

          {/* Quick Hire details & Stats */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-300 font-bold text-[10px]">
                {user.hourlyRateKes || 'KES 8,500/hr'}
              </span>
            </div>
            <span>Invites: <strong className="text-slate-100">{user.referralsCount}</strong></span>
          </div>

          {/* Hire Button */}
          <button
            type="button"
            onClick={() => {
              if (onOpenHireModal) {
                onOpenHireModal();
              } else {
                onSelectTab('jobs');
              }
            }}
            className="w-full py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-950"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Hire Specialist</span>
          </button>
        </div>
      )}

      {/* Main Navigation Links */}
      <div className="space-y-1 flex-1">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
          Workspaces
        </div>
        {navigation.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer group ${
                isActive
                  ? 'bg-slate-900 text-emerald-400 border border-emerald-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/50">
                  {item.badge}
                </span>
              )}

              {item.count !== undefined && (
                <span className="text-[11px] font-mono tabular-nums text-slate-500 group-hover:text-slate-300">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Network & Encryption Status footer with stealth baked trigger */}
      <div className="mt-auto pt-4 border-t border-slate-800/80">
        <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span
              onClick={onTriggerSecretAdmin}
              className="text-slate-400 flex items-center gap-1.5 cursor-default select-none"
              title="Encrypted Node Telemetry"
            >
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              Node
            </span>
            <span className="font-mono text-slate-300">Nairobi IXP 01</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              Crypto Engine
            </span>
            <span className="font-mono text-emerald-400">AES-256-GCM</span>
          </div>

          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 font-mono">
            KeCERT Secure Channel Active
          </div>
        </div>
      </div>
    </aside>
  );
};
