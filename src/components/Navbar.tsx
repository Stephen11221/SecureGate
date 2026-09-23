import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Bell,
  CheckCircle2,
  Mail,
  Briefcase
} from 'lucide-react';
import { VerificationBadge } from './ui/VerificationBadge';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenHireModal?: () => void;
  onTriggerSecretAdmin?: () => void;
  unreadMessagesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
  onOpenHireModal,
  onTriggerSecretAdmin,
  unreadMessagesCount = 3
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [clickCount, setClickCount] = useState(0);

  // Purely clean public navigation — NO visible admin buttons or links
  const navItems = [
    { id: 'feed', label: 'Feed' },
    { id: 'jobs', label: 'Job Board' },
    { id: 'comms', label: 'Comms' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'codevault', label: 'Code Vault' },
    { id: 'forums', label: 'Forums' }
  ];

  // Discreet stealth trigger: triple click on the badge
  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextCount = clickCount + 1;
    if (nextCount >= 3) {
      setClickCount(0);
      onTriggerSecretAdmin?.();
    } else {
      setClickCount(nextCount);
      setTimeout(() => setClickCount(0), 1200);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('feed')}
              className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors flex items-center gap-2 group cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 group-hover:scale-110 transition-transform" />
              <span className="font-semibold tracking-wide">SecureGate</span>
            </button>

            {/* Stealth click on KE·INFOSPEC badge (3 clicks opens baked monitoring) */}
            <span
              onClick={handleBadgeClick}
              title="SecureGate Node Kenya (Triple-click for hidden baked monitor)"
              className="text-xs font-mono font-normal text-emerald-400/90 border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-950/40 hidden sm:inline-block cursor-default select-none"
            >
              KE·INFOSPEC
            </span>
          </div>
        </div>

        {/* Public Navigation links - strictly clean, no admin buttons */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
          {navItems.map(item => {
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Zone: Inbox Button, Hire Button, Verification Badge & Profile */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              
              {/* Dedicated INBOX BUTTON */}
              <button
                type="button"
                onClick={() => onSelectTab('comms')}
                className={`relative p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
                  currentTab === 'comms'
                    ? 'bg-slate-900 border-emerald-500/50 text-emerald-400 shadow-sm'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Encrypted Inbox & Direct Messages"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline font-mono">Inbox</span>
                {unreadMessagesCount > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-sm">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* Dedicated HIRE BUTTON */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenHireModal) {
                    onOpenHireModal();
                  } else {
                    onSelectTab('jobs');
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm shadow-emerald-950"
                title="Hire top Kenyan cybersecurity specialist"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Hire</span>
              </button>

              {/* Biometric + Phone 2FA Verification Pill */}
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-[11px]">MFA Verified</span>
              </div>

              {/* User Profile, Verification Badge & Lock */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <button
                  onClick={() => onSelectTab('referrals')}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded transition-colors cursor-pointer"
                  title="Invite & Referral Center"
                >
                  <Bell className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-emerald-500/40 object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      <VerificationBadge
                        verified={user.verified}
                        level={user.verificationLevel}
                        size="sm"
                        user={user}
                      />
                    </div>
                  </div>

                  <div className="hidden xl:block text-left">
                    <div className="text-xs font-semibold text-slate-200 leading-none truncate max-w-[120px] flex items-center gap-1">
                      <span>{user.handle}</span>
                      <VerificationBadge verified={user.verified} level={user.verificationLevel} size="sm" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono leading-none mt-1">
                      {user.location.split(',')[0]}
                    </div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors cursor-pointer whitespace-nowrap"
                  title="Lock terminal and wipe volatile keys"
                >
                  Lock
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer shadow-sm shadow-emerald-950"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Verify Access</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
