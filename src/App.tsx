import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ui/ToastNotification';
import { AuthModal } from './components/auth/AuthModal';
import { FeedView } from './components/feed/FeedView';
import { EncryptedCommsView } from './components/messaging/EncryptedCommsView';
import { ChallengeBoardsView } from './components/challenges/ChallengeBoardsView';
import { CodeVaultView } from './components/codevault/CodeVaultView';
import { ForumsView } from './components/forum/ForumsView';
import { JobBoardView } from './components/jobs/JobBoardView';
import { AdminReviewLogsView } from './components/admin/AdminReviewLogsView';
import { ReferralCenterView } from './components/referrals/ReferralCenterView';
import { HireSpecialistModal } from './components/hire/HireSpecialistModal';

import {
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_DIRECT_MESSAGES,
  INITIAL_CHALLENGES,
  INITIAL_LEADERBOARD,
  INITIAL_RESOURCES,
  INITIAL_FORUMS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BACKUPS,
  INITIAL_JOBS,
  OTHER_SPECIALISTS
} from './data/mockData';

import {
  Post,
  Story,
  DirectMessage,
  Challenge,
  LeaderboardUser,
  CodingResource,
  ForumThread,
  AuditLog,
  BackupSnapshot,
  Job,
  User,
  HireProposal
} from './types';

import {
  Rss,
  MessageSquareLock,
  Flag,
  Code2,
  Users,
  Briefcase
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { isAuthenticated, is2FAVerified, user, setUser, addToast } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('feed');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Hire Specialist modal state
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [specialistForHire, setSpecialistForHire] = useState<User>(OTHER_SPECIALISTS[0]);

  // App-wide state
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [messages, setMessages] = useState<DirectMessage[]>(INITIAL_DIRECT_MESSAGES);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  const [resources, setResources] = useState<CodingResource[]>(INITIAL_RESOURCES);
  const [forums, setForums] = useState<ForumThread[]>(INITIAL_FORUMS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [backups, setBackups] = useState<BackupSnapshot[]>(INITIAL_BACKUPS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

  // Hidden / Baked Admin listener:
  // Shortcut: Ctrl+Shift+A (or Cmd+Shift+A) or Ctrl+Alt+M or URL '#baked' or '?admin=baked'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if ((mod && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
          (e.ctrlKey && e.altKey && (e.key === 'M' || e.key === 'm')) ||
          (mod && e.shiftKey && (e.key === 'B' || e.key === 'b'))) {
        e.preventDefault();
        setCurrentTab(prev => {
          const next = prev === 'admin' ? 'feed' : 'admin';
          addToast({
            type: next === 'admin' ? 'security_alert' : 'info',
            title: next === 'admin' ? 'Baked Admin Console Activated' : 'Stealth Console Closed',
            message: next === 'admin'
              ? 'Entered hidden background monitoring stream. Invisible on public site.'
              : 'Returned to public member interface.'
          });
          return next;
        });
      }
    };

    // Check URL query parameter or hash on load
    if (window.location.search.includes('admin=baked') ||
        window.location.hash === '#baked' ||
        window.location.hash === '#admin') {
      setCurrentTab('admin');
    }

    const handleHashChange = () => {
      if (window.location.hash === '#baked' || window.location.hash === '#admin') {
        setCurrentTab('admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [addToast]);

  const handleOpenSecretAdmin = () => {
    setCurrentTab('admin');
    addToast({
      type: 'security_alert',
      title: 'Baked Admin Stream Activated',
      message: 'Monitoring all site activity and backed snapshots.'
    });
  };

  // Unread messages calculation
  const unreadCount = messages.length > 0 ? 3 : 0;

  // Challenge solve handler
  const handleSolveChallenge = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(c => {
        if (c.id === challengeId) {
          return {
            ...c,
            userSolved: true,
            solvedCount: c.solvedCount + 1
          };
        }
        return c;
      })
    );

    // Update user score
    const targetChallenge = challenges.find(c => c.id === challengeId);
    if (targetChallenge && user) {
      const addedPoints = targetChallenge.points;
      setUser(prev => (prev ? { ...prev, reputation: prev.reputation + addedPoints } : null));

      // Update in leaderboard
      setLeaderboard(prev =>
        prev
          .map(lb => {
            if (lb.id === user.id) {
              return {
                ...lb,
                score: lb.score + addedPoints,
                challengesSolved: lb.challengesSolved + 1
              };
            }
            return lb;
          })
          .sort((a, b) => b.score - a.score)
          .map((item, idx) => ({ ...item, rank: idx + 1 }))
      );

      // Add audit log entry
      const newLog: AuditLog = {
        id: 'log_' + Math.random().toString(36).substring(2, 7),
        timestamp: 'Just now',
        event: `CTF Flag Captured: ${targetChallenge.title}`,
        ipAddress: '197.232.89.44',
        location: 'Nairobi, KE',
        device: 'Browser Client',
        status: 'Nominal',
        details: `Successfully solved challenge and credited ${addedPoints} points.`
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  // Add post handler
  const handleAddPost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);

    // Audit log
    const newLog: AuditLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 7),
      timestamp: 'Just now',
      event: 'Encrypted Research Published',
      ipAddress: '197.232.89.44',
      location: 'Nairobi, KE',
      device: 'SecureGate Client',
      status: 'Verified',
      details: `Dispatched post with SHA-256 digest ${newPost.cryptoMeta.sha256Hash.slice(0, 16)}...`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleUpdatePost = (updated: Post) => {
    setPosts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const handleSendMessage = (msg: DirectMessage) => {
    setMessages(prev => [...prev, msg]);
    const newLog: AuditLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 7),
      timestamp: 'Just now',
      event: 'Encrypted E2EE Comms Packet Delivered',
      ipAddress: '197.232.89.44',
      location: 'Nairobi, KE',
      device: 'Cryptographic Tunnel',
      status: 'Verified',
      details: `Message packet sent to recipient with AES-256-GCM sealed payload.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAddResource = (res: CodingResource) => {
    setResources(prev => [res, ...prev]);
    const newLog: AuditLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 7),
      timestamp: 'Just now',
      event: `Code Vault Artifact Committed: ${res.title}`,
      ipAddress: '197.232.89.44',
      location: 'Nairobi, KE',
      device: 'Git/PGP Client',
      status: 'Nominal',
      details: `Exploit POC / tool script archived into SecureGate repository.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateResource = (res: CodingResource) => {
    setResources(prev => prev.map(r => (r.id === res.id ? res : r)));
  };

  const handleAddThread = (thread: ForumThread) => {
    setForums(prev => [thread, ...prev]);
    const newLog: AuditLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 7),
      timestamp: 'Just now',
      event: `Forum Advisory Topic Opened: ${thread.title}`,
      ipAddress: '197.232.89.44',
      location: 'Nairobi, KE',
      device: 'Secure Client',
      status: 'Nominal',
      details: `Encrypted discussion thread created in #${thread.channel}.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateThread = (thread: ForumThread) => {
    setForums(prev => prev.map(t => (t.id === thread.id ? thread : t)));
  };

  const handleAddJob = (job: Job) => {
    setJobs(prev => [job, ...prev]);
    const newLog: AuditLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 7),
      timestamp: 'Just now',
      event: `Cyber Job Opening Published: ${job.title}`,
      ipAddress: '197.232.89.44',
      location: 'Nairobi, KE',
      device: 'Employer Portal',
      status: 'Verified',
      details: `Listed role by ${job.company} offering ${job.salaryKes}. Verified by KeCERT.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAddBackup = (backup: BackupSnapshot) => {
    setBackups(prev => [backup, ...prev]);
    const newLog: AuditLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 7),
      timestamp: 'Just now',
      event: 'Encrypted Cloud Backup Snapshot Stored',
      ipAddress: '197.232.89.44',
      location: 'Nairobi, KE',
      device: 'Vault Daemon',
      status: 'Verified',
      details: `Snapshot #${backup.id} sealed with AES-256-GCM. SHA-256: ${backup.sha256Hash.slice(0, 16)}...`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Open Hire modal targeting a specific specialist
  const handleOpenHireForAuthor = (author: Post['author']) => {
    const matched = OTHER_SPECIALISTS.find(s => s.handle === author.handle) || {
      id: author.id,
      username: author.handle.replace('@', ''),
      handle: author.handle,
      fullName: author.name,
      avatar: author.avatar,
      bio: `${author.role} researching zero-day resilience in Kenya.`,
      location: author.location,
      role: author.role,
      verified: true,
      phone: '+254 700 000 000',
      pgpFingerprint: '9921 4401 2291 BBAA C102 9901 FF42 1109',
      reputation: 2100,
      referralCode: 'SEC-KE-INVITE',
      referralsCount: 6,
      joinedAt: 'November 2025',
      is2FAEnabled: true,
      faceScanVerified: true,
      phoneVerified: true,
      verificationLevel: 'KeCERT Elite',
      hourlyRateKes: 'KES 8,500 / hr',
      availableForHire: true
    } as User;

    setSpecialistForHire(matched);
    setIsHireModalOpen(true);
  };

  // Public mobile navigation tabs - strictly clean, zero admin buttons
  const mobileTabs = [
    { id: 'feed', icon: Rss, label: 'Feed' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs' },
    { id: 'comms', icon: MessageSquareLock, label: 'Inbox' },
    { id: 'challenges', icon: Flag, label: 'CTF' },
    { id: 'codevault', icon: Code2, label: 'Vault' },
    { id: 'forums', icon: Users, label: 'Forums' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      
      {/* Toast notifications container (SMS OTP banner & security alerts) */}
      <ToastContainer />

      {/* Top Bar Navigation (Clean public view with hidden baked trigger) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenHireModal={() => {
          setSpecialistForHire(OTHER_SPECIALISTS[0]);
          setIsHireModalOpen(true);
        }}
        onTriggerSecretAdmin={handleOpenSecretAdmin}
        unreadMessagesCount={unreadCount}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 lg:pb-0">
        
        {/* Left Sidebar (Desktop, clean public view with hidden baked trigger) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenHireModal={() => {
            setSpecialistForHire(OTHER_SPECIALISTS[0]);
            setIsHireModalOpen(true);
          }}
          onTriggerSecretAdmin={handleOpenSecretAdmin}
        />

        {/* Viewport Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'feed' && (
            <FeedView
              posts={posts}
              stories={stories}
              onAddPost={handleAddPost}
              onUpdatePost={handleUpdatePost}
              onHireAuthor={handleOpenHireForAuthor}
            />
          )}

          {currentTab === 'jobs' && (
            <JobBoardView
              jobs={jobs}
              specialists={OTHER_SPECIALISTS}
              onAddJob={handleAddJob}
              onSendMessage={handleSendMessage}
            />
          )}

          {currentTab === 'comms' && (
            <EncryptedCommsView
              specialists={OTHER_SPECIALISTS}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          )}

          {currentTab === 'challenges' && (
            <ChallengeBoardsView
              challenges={challenges}
              leaderboard={leaderboard}
              onSolveChallenge={handleSolveChallenge}
            />
          )}

          {currentTab === 'codevault' && (
            <CodeVaultView
              resources={resources}
              onAddResource={handleAddResource}
              onUpdateResource={handleUpdateResource}
            />
          )}

          {currentTab === 'forums' && (
            <ForumsView
              threads={forums}
              onAddThread={handleAddThread}
              onUpdateThread={handleUpdateThread}
            />
          )}

          {/* Hidden on Baked: Admin Monitoring Console & Backups Review */}
          {(currentTab === 'admin' || currentTab === 'security' || currentTab === 'backup') && (
            <AdminReviewLogsView
              logs={auditLogs}
              backups={backups}
              posts={posts}
              messages={messages}
              challenges={challenges}
              resources={resources}
              onAddBackup={handleAddBackup}
              onCloseHiddenMonitor={() => setCurrentTab('feed')}
            />
          )}

          {currentTab === 'referrals' && <ReferralCenterView />}
        </main>
      </div>

      {/* Mobile Sticky Bottom Tab Bar - Strictly Public */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around py-2 px-1">
        {mobileTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 text-[10px] p-1 transition-colors cursor-pointer ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Auth Modal (Phone OTP + Biometric Face Scan + Referral Prompt) */}
      <AuthModal
        isOpen={isAuthModalOpen || !isAuthenticated || !is2FAVerified}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Direct Hire Specialist Engagement Modal */}
      <HireSpecialistModal
        specialist={specialistForHire}
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        onProposalSent={(proposal: HireProposal, dm: DirectMessage) => {
          handleSendMessage(dm);
          addToast({
            type: 'success',
            title: 'Hire Proposal Transmitted',
            message: `Proposal for "${proposal.projectTitle}" delivered to ${proposal.specialistHandle}.`
          });
        }}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
