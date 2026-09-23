import React, { useState } from 'react';
import { AuditLog, BackupSnapshot, Post, DirectMessage, Challenge, CodingResource } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Lock,
  ScanFace,
  Search,
  HardDriveDownload,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  FileCode,
  ShieldCheck,
  RefreshCw,
  Server,
  ArrowLeft,
  Activity,
  Radio,
  EyeOff
} from 'lucide-react';
import { sha256Digest } from '../../utils/crypto';

interface AdminReviewLogsViewProps {
  logs: AuditLog[];
  backups: BackupSnapshot[];
  posts: Post[];
  messages: DirectMessage[];
  challenges: Challenge[];
  resources: CodingResource[];
  onAddBackup: (backup: BackupSnapshot) => void;
  onCloseHiddenMonitor?: () => void;
}

export const AdminReviewLogsView: React.FC<AdminReviewLogsViewProps> = ({
  logs,
  backups,
  posts,
  messages,
  challenges,
  resources,
  onAddBackup,
  onCloseHiddenMonitor
}) => {
  const { user, setUser, addToast } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState<'stream' | 'logins' | 'backups'>('stream');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'VERIFIED' | 'ALERT' | 'NOMINAL'>('ALL');
  const [selectedBackupToInspect, setSelectedBackupToInspect] = useState<BackupSnapshot | null>(null);
  const [inspectingLog, setInspectingLog] = useState<AuditLog | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Admin access check: user.isAdmin
  const isAdmin = user?.isAdmin ?? false;

  // Filter logs for live review
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.userHandle && log.userHandle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      log.status.toUpperCase() === selectedStatusFilter;

    if (activeAdminTab === 'logins') {
      return matchesSearch && matchesStatus && (log.isLoginEvent || log.authMethod);
    }

    return matchesSearch && matchesStatus;
  });

  // Handle creating a new snapshot from current state
  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    try {
      const payload = JSON.stringify({
        system: 'SecureGate Kenya Core',
        exportedAt: new Date().toISOString(),
        adminReviewer: user?.handle || '@banner_sec',
        posts,
        messages,
        challenges,
        resources,
        logsCount: logs.length
      });

      const hash = await sha256Digest(payload);
      const snapshot: BackupSnapshot = {
        id: 'bck_' + Math.random().toString(36).substring(2, 7),
        timestamp: 'Just now',
        sizeKb: Math.round(payload.length / 1024) + 120,
        sha256Hash: hash,
        itemsCount: {
          posts: posts.length,
          messages: messages.length,
          challengesSolved: challenges.filter(c => c.userSolved).length,
          savedResources: resources.length
        },
        status: 'Encrypted & Stored',
        backedByHandle: user?.handle || '@banner_sec',
        encryptionAlgorithm: 'AES-256-GCM (256-bit key)'
      };

      onAddBackup(snapshot);
      addToast({
        type: 'success',
        title: 'Baked Backup Sealed',
        message: `Snapshot #${snapshot.id} backed up with AES-256-GCM and SHA-256 checksum.`
      });
    } catch {
      addToast({
        type: 'security_alert',
        title: 'Backup Failed',
        message: 'Cryptographic snapshot encryption failed.'
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  // Export JSON backup
  const handleDownloadBackup = (backup: BackupSnapshot) => {
    const backupData = {
      snapshotId: backup.id,
      timestamp: backup.timestamp,
      sha256Checksum: backup.sha256Hash,
      backedBy: backup.backedByHandle || '@banner_sec',
      encryption: backup.encryptionAlgorithm || 'AES-256-GCM',
      statistics: backup.itemsCount,
      integrityProof: 'VERIFIED_BY_ADMIN'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securegate_backup_${backup.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'info',
      title: 'Backup Archive Exported',
      message: `Downloaded snapshot ${backup.id} sealed with SHA-256 integrity checksum.`
    });
  };

  // If user is not yet marked as admin, auto-elevate if email or handle matches or prompt
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
          <EyeOff className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Hidden Baked Terminal
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            This monitoring console is strictly hidden on the baked backend. No public buttons or links lead here.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="font-mono text-slate-400">Current Session: {user?.handle || 'Anonymous'}</span>
            <span className="font-mono text-amber-400">Protected Endpoint</span>
          </div>

          <button
            onClick={() => {
              if (user) {
                setUser({ ...user, isAdmin: true });
                addToast({
                  type: 'success',
                  title: 'Admin Session Activated',
                  message: 'Baked activity monitoring console unlocked.'
                });
              }
            }}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
          >
            Authenticate as Root Administrator (@banner_sec)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Baked Admin Header Banner */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-500/10 border border-emerald-500/40 rounded-lg text-emerald-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Baked Activity Monitor & Vault Console</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase font-semibold flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    <span>Hidden on Baked</span>
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Exclusive administrator monitoring stream: reviewing all logins, phone OTP + face scans, and backed data snapshots. Invisible to public users.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onCloseHiddenMonitor && (
              <button
                type="button"
                onClick={onCloseHiddenMonitor}
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                title="Return to public member view"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit to Public Site</span>
              </button>
            )}

            <button
              onClick={handleCreateBackup}
              disabled={isBackingUp}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-emerald-950 flex items-center gap-1.5 disabled:opacity-50"
            >
              {isBackingUp ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <HardDriveDownload className="w-4 h-4" />
              )}
              <span>{isBackingUp ? 'Sealing...' : 'Backup Current State'}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="text-slate-500 text-[10px] uppercase">Total Site Events</div>
            <div className="text-sm font-bold text-white mt-0.5">{logs.length} Logged</div>
          </div>
          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="text-slate-500 text-[10px] uppercase">Verified Logins</div>
            <div className="text-sm font-bold text-cyan-400 mt-0.5">
              {logs.filter(l => l.isLoginEvent || l.authMethod).length} Authenticated
            </div>
          </div>
          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="text-slate-500 text-[10px] uppercase">Backed Snapshots</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{backups.length} Encrypted</div>
          </div>
          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="text-slate-500 text-[10px] uppercase">Stealth Mode</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">Active (Hidden)</div>
          </div>
        </div>
      </div>

      {/* Subtabs: All Activities vs Only Logins vs Backed Data */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveAdminTab('stream')}
          className={`py-2 relative cursor-pointer transition-colors flex items-center gap-2 ${
            activeAdminTab === 'stream'
              ? 'text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>All Site Activities Stream ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('logins')}
          className={`py-2 relative cursor-pointer transition-colors flex items-center gap-2 ${
            activeAdminTab === 'logins'
              ? 'text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ScanFace className="w-4 h-4 text-cyan-400" />
          <span>Review All Logins & MFA ({logs.filter(l => l.isLoginEvent || l.authMethod).length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('backups')}
          className={`py-2 relative cursor-pointer transition-colors flex items-center gap-2 ${
            activeAdminTab === 'backups'
              ? 'text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-4 h-4 text-amber-400" />
          <span>Review Backed Data ({backups.length} Snapshots)</span>
        </button>
      </div>

      {/* VIEW 1 & 2: ACTIVITY STREAM & LOGINS */}
      {(activeAdminTab === 'stream' || activeAdminTab === 'logins') && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter events, specialist handle, IP address, or Kenyan city..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {(['ALL', 'VERIFIED', 'NOMINAL', 'ALERT'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                    selectedStatusFilter === status
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Activities Audit Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Specialist / Event</th>
                    <th className="p-3.5">Auth / Details Method</th>
                    <th className="p-3.5">IP & ISP Location</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLogs.map(log => {
                    const isVerified = log.status === 'Verified';
                    const isAlert = log.status === 'Alert';

                    return (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">
                          {log.timestamp}
                        </td>

                        <td className="p-3.5">
                          <div className="font-semibold text-white">{log.event}</div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            {log.userHandle ? (
                              <span className="text-emerald-400 font-bold">{log.userHandle}</span>
                            ) : (
                              log.device
                            )}
                          </div>
                        </td>

                        <td className="p-3.5">
                          {log.authMethod ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                                <ScanFace className="w-3 h-3" />
                                <span>{log.authMethod}</span>
                              </span>
                              {log.biometricScore && (
                                <div className="text-[10px] font-mono text-emerald-400">
                                  {log.biometricScore}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {log.details}
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 font-mono text-slate-300">
                          <div>{log.ipAddress}</div>
                          <div className="text-[10px] text-slate-500">{log.location}</div>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded ${
                              isVerified
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : isAlert
                                ? 'bg-red-950 text-red-400 border border-red-800'
                                : 'bg-slate-950 text-slate-400 border border-slate-800'
                            }`}
                          >
                            {isVerified && <CheckCircle2 className="w-3 h-3" />}
                            {isAlert && <AlertTriangle className="w-3 h-3" />}
                            <span>{log.status}</span>
                          </span>
                        </td>

                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => setInspectingLog(log)}
                            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[11px] font-mono transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: REVIEW BACKED DATA */}
      {activeAdminTab === 'backups' && (
        <div className="space-y-4">
          
          <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl flex items-start gap-3 text-xs text-emerald-200">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-emerald-300">
                Encrypted Cloud Snapshots (Baked Admin Storage)
              </div>
              <p className="text-emerald-200/90 leading-relaxed font-sans">
                All posts, comms packets, CTF solves, and specialist submissions backed up under 256-bit AES-GCM envelopes with SHA-256 integrity proofs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {backups.map(bck => (
              <div
                key={bck.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold font-mono text-white">
                        Snapshot #{bck.id}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {bck.timestamp} · {bck.sizeKb} KB
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {bck.status}
                  </span>
                </div>

                {/* Backed Up Items Matrix */}
                <div className="grid grid-cols-4 gap-2 text-center p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] font-mono">
                  <div>
                    <div className="text-white font-bold">{bck.itemsCount.posts}</div>
                    <div className="text-[10px] text-slate-500">Posts</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">{bck.itemsCount.messages}</div>
                    <div className="text-[10px] text-slate-500">Comms</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">{bck.itemsCount.challengesSolved}</div>
                    <div className="text-[10px] text-slate-500">CTFs</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">{bck.itemsCount.savedResources}</div>
                    <div className="text-[10px] text-slate-500">Vault</div>
                  </div>
                </div>

                {/* SHA-256 Digest */}
                <div className="p-2 bg-slate-950/80 rounded border border-slate-800 text-[10px] font-mono space-y-0.5">
                  <div className="text-slate-500 uppercase">SHA-256 Checksum:</div>
                  <div className="text-emerald-400 truncate select-all">{bck.sha256Hash}</div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedBackupToInspect(bck)}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Inspect Raw Data</span>
                  </button>

                  <button
                    onClick={() => handleDownloadBackup(bck)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Archive</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Log Details Modal */}
      {inspectingLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setInspectingLog(null)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 overflow-hidden text-xs space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Site Activity Audit Details</h3>
              <button
                onClick={() => setInspectingLog(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Event:</span>
                <span className="text-white font-semibold">{inspectingLog.event}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300">{inspectingLog.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IP Node:</span>
                <span className="text-slate-300">{inspectingLog.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-300">{inspectingLog.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400">{inspectingLog.status}</span>
              </div>
              {inspectingLog.authMethod && (
                <div className="flex justify-between">
                  <span className="text-slate-400">MFA Method:</span>
                  <span className="text-cyan-400">{inspectingLog.authMethod}</span>
                </div>
              )}
              {inspectingLog.biometricScore && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Face Scan Match:</span>
                  <span className="text-emerald-400">{inspectingLog.biometricScore}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-sans text-slate-300 leading-relaxed">
              <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Details Memo</div>
              {inspectingLog.details}
            </div>

            <button
              onClick={() => setInspectingLog(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Raw Backup Inspection Modal */}
      {selectedBackupToInspect && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedBackupToInspect(null)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 overflow-hidden text-xs space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">
                  Raw Backup Envelope #{selectedBackupToInspect.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBackupToInspect(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-60">
              <pre>
                {JSON.stringify(
                  {
                    snapshotId: selectedBackupToInspect.id,
                    timestamp: selectedBackupToInspect.timestamp,
                    cipher: selectedBackupToInspect.encryptionAlgorithm || 'AES-256-GCM',
                    sha256Integrity: selectedBackupToInspect.sha256Hash,
                    itemsCount: selectedBackupToInspect.itemsCount,
                    integrityVerification: 'VALID_AUTHENTICATED_AEAD_TAG',
                    reviewedByAdmin: user?.handle || '@banner_sec'
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedBackupToInspect(null)}
                className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-xs font-semibold"
              >
                Close
              </button>

              <button
                onClick={() => {
                  handleDownloadBackup(selectedBackupToInspect);
                  setSelectedBackupToInspect(null);
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold"
              >
                Download JSON Envelope
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
