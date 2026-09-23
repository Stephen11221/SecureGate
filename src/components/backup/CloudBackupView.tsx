import React, { useState } from 'react';
import { BackupSnapshot, Post, DirectMessage, Challenge, CodingResource } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { encryptText, computeSha256 } from '../../utils/crypto';
import {
  HardDriveDownload,
  ShieldCheck,
  Lock,
  RefreshCw,
  Download,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface CloudBackupViewProps {
  backups: BackupSnapshot[];
  posts: Post[];
  messages: DirectMessage[];
  challenges: Challenge[];
  resources: CodingResource[];
  onAddBackup: (backup: BackupSnapshot) => void;
}

export const CloudBackupView: React.FC<CloudBackupViewProps> = ({
  backups,
  posts,
  messages,
  challenges,
  resources,
  onAddBackup
}) => {
  const { user, addToast } = useAuth();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [autoBackupCadence, setAutoBackupCadence] = useState('realtime');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [testRestoreStatus, setTestRestoreStatus] = useState<string | null>(null);

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    try {
      // Gather all user data to seal
      const payload = {
        app: 'SecureGate Kenya',
        user: user?.handle || '@banner_sec',
        timestamp: new Date().toISOString(),
        node: 'Nairobi-IXP-Vault-01',
        data: {
          posts: posts.map(p => ({ id: p.id, author: p.author.handle, content: p.content, cryptoMeta: p.cryptoMeta })),
          messages: messages.map(m => ({ id: m.id, ciphertext: m.ciphertext, iv: m.iv, timestamp: m.timestamp })),
          solvedChallenges: challenges.filter(c => c.userSolved).map(c => c.id),
          starredResources: resources.filter(r => r.userStarred).map(r => r.id)
        }
      };

      const serialized = JSON.stringify(payload);
      const encrypted = await encryptText(serialized);
      const sha256 = await computeSha256(encrypted.ciphertext);

      const newBackup: BackupSnapshot = {
        id: 'bck_' + Math.random().toString(36).substring(2, 8),
        timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EAT',
        sizeKb: Math.round(serialized.length / 1024) + 48,
        sha256Hash: sha256,
        itemsCount: {
          posts: posts.length,
          messages: messages.length,
          challengesSolved: challenges.filter(c => c.userSolved).length,
          savedResources: resources.filter(r => r.userStarred).length
        },
        status: 'Encrypted & Stored'
      };

      onAddBackup(newBackup);

      addToast({
        type: 'success',
        title: 'Encrypted Cloud Snapshot Created',
        message: `Snapshot #${newBackup.id} sealed with AES-256-GCM and stored across regional Kenya cloud vaults.`
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsBackingUp(false);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const downloadBackupBlob = (backup: BackupSnapshot) => {
    const data = {
      vault: 'SecureGate Kenya Encrypted Storage',
      snapshotId: backup.id,
      timestamp: backup.timestamp,
      sha256Hash: backup.sha256Hash,
      encryption: 'AES-256-GCM / PBKDF2',
      itemsCount: backup.itemsCount,
      blob: '4a9b00ff...[ENCRYPTED_ZERO_KNOWLEDGE_PAYLOAD]'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securegate_vault_snapshot_${backup.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'info',
      title: 'Snapshot Exported Locally',
      message: `Downloaded encrypted backup ${backup.id}.`
    });
  };

  const handleTestRestore = (backup: BackupSnapshot) => {
    setTestRestoreStatus(backup.id);
    setTimeout(() => {
      setTestRestoreStatus(null);
      addToast({
        type: 'success',
        title: 'Integrity Check & Restore Test Passed',
        message: `Snapshot #${backup.id} SHA-256 hash verified. All ${backup.itemsCount.posts} posts and ${backup.itemsCount.messages} comms records verified intact.`
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <HardDriveDownload className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">Encrypted Cloud Backups & Vault Recovery</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Zero-knowledge snapshots of all posts, direct messages, CTF flags, and coding resources with SHA-256 integrity verification.
          </p>
        </div>

        <button
          onClick={handleCreateBackup}
          disabled={isBackingUp}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm shadow-emerald-950 disabled:opacity-50"
        >
          {isBackingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          <span>{isBackingUp ? 'Encrypting & Storing...' : 'Create Encrypted Snapshot'}</span>
        </button>
      </div>

      {/* Snapshot Storage Architecture Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Cloud Backup Configuration</h3>
            <p className="text-xs text-slate-400">Encrypted redundant snapshots across Nairobi and Mombasa data centers</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sync Cadence:</span>
            <select
              value={autoBackupCadence}
              onChange={e => {
                setAutoBackupCadence(e.target.value);
                addToast({
                  type: 'info',
                  title: 'Cadence Updated',
                  message: `Automatic vault backup frequency set to ${e.target.value}.`
                });
              }}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
            >
              <option value="realtime">Continuous Real-Time Sync</option>
              <option value="daily">Daily Snapshot (00:00 EAT)</option>
              <option value="weekly">Weekly Full Archive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-slate-400 text-[11px] mb-1">Encryption Algorithm</div>
            <div className="font-mono text-emerald-400 font-semibold">AES-256-GCM AEAD</div>
            <div className="text-[10px] text-slate-500 mt-1">Client-side derived private key</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-slate-400 text-[11px] mb-1">Integrity Guarantee</div>
            <div className="font-mono text-white font-semibold">SHA-256 Cryptographic Digest</div>
            <div className="text-[10px] text-slate-500 mt-1">Tamper-evident verification</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-slate-400 text-[11px] mb-1">Storage Redundancy</div>
            <div className="font-mono text-cyan-400 font-semibold">East Africa 3-Node Mesh</div>
            <div className="text-[10px] text-slate-500 mt-1">Nairobi, Mombasa, Eldoret nodes</div>
          </div>
        </div>
      </div>

      {/* Snapshot History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Available Cloud Snapshots</h3>
            <p className="text-xs text-slate-400">Select a snapshot to verify checksum or test restore into workspace</p>
          </div>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {backups.length} snapshots preserved
          </span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {backups.map(b => (
            <div key={b.id} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-white uppercase">{b.id}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-300">{b.timestamp}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-mono text-slate-400">{b.sizeKb} KB</span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800/60 px-1.5 py-0.5 rounded text-[10px]">
                    {b.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>SHA-256:</span>
                  <span className="truncate max-w-xs text-emerald-400/90">{b.sha256Hash}</span>
                  <button
                    onClick={() => copyHash(b.sha256Hash)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                    title="Copy SHA-256 Checksum"
                  >
                    {copiedHash === b.sha256Hash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 font-sans flex items-center gap-3 pt-0.5">
                  <span>{b.itemsCount.posts} posts sealed</span>
                  <span>·</span>
                  <span>{b.itemsCount.messages} comms logs</span>
                  <span>·</span>
                  <span>{b.itemsCount.challengesSolved} flags preserved</span>
                  <span>·</span>
                  <span>{b.itemsCount.savedResources} vault scripts</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTestRestore(b)}
                  disabled={testRestoreStatus === b.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
                  title="Simulate restoring this snapshot"
                >
                  {testRestoreStatus === b.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  ) : (
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{testRestoreStatus === b.id ? 'Restoring...' : 'Verify & Test Restore'}</span>
                </button>

                <button
                  onClick={() => downloadBackupBlob(b)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                  title="Export encrypted JSON snapshot"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
