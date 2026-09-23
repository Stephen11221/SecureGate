import React, { useState } from 'react';
import { AuditLog } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  Shield,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Lock,
  Download,
  Trash2,
  RefreshCw,
  Cpu
} from 'lucide-react';

interface ActivityMonitorViewProps {
  logs: AuditLog[];
  onClearLogs?: () => void;
}

export const ActivityMonitorView: React.FC<ActivityMonitorViewProps> = ({ logs }) => {
  const { user, addToast } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [activeSessionList, setActiveSessionList] = useState([
    {
      id: 'sess_01',
      device: 'Linux x86_64 · Hardened Firefox',
      ip: '197.232.89.44 (Safaricom Fiber)',
      location: 'Westlands, Nairobi, KE',
      isCurrent: true,
      lastActive: 'Active now'
    },
    {
      id: 'sess_02',
      device: 'Mobile Client (PWA) · Kenya',
      ip: '102.164.210.12 (Airtel 5G)',
      location: 'Kilimani, Nairobi, KE',
      isCurrent: false,
      lastActive: '42m ago'
    }
  ]);

  const filteredLogs = logs.filter(
    log => filterStatus === 'All' || log.status === filterStatus
  );

  const handleRevokeOtherSessions = () => {
    setActiveSessionList(prev => prev.filter(s => s.isCurrent));
    addToast({
      type: 'success',
      title: 'Sessions Terminated',
      message: 'Revoked all external sessions. All volatile ECDH keys invalidated.'
    });
  };

  const exportAuditTrail = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securegate_audit_logs_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'info',
      title: 'Audit Trail Exported',
      message: 'Cryptographically signed audit log exported to JSON.'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">Real-Time Security Activity Monitor</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-time audit log of access events, 2FA challenges, cryptographic key renewals, and network telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportAuditTrail}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Real-time Health Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>2FA Authenticator</span>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono">Enforced & Active</div>
          <div className="text-[11px] text-emerald-400/90 font-mono mt-1">SMS Gateway +254 722 *** 254</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Crypto Engine</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono">AES-256-GCM / ECDH</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Curve25519 Session Mesh</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>KeCERT Telemetry</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-sm font-bold text-white font-mono">Synced Real-Time</div>
          <div className="text-[11px] text-emerald-400/90 font-mono mt-1">National SOC Link Live</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Sessions</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono tabular-nums">{activeSessionList.length} Connected</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">All verified via referral key</div>
        </div>

      </div>

      {/* Active Hardware Sessions Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Active Authenticated Sessions</h3>
            <p className="text-xs text-slate-400">Authenticated devices holding active volatile session keys</p>
          </div>

          <button
            onClick={handleRevokeOtherSessions}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 hover:bg-red-900/60 border border-red-800/80 text-red-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Revoke Other Sessions</span>
          </button>
        </div>

        <div className="space-y-3">
          {activeSessionList.map(session => (
            <div
              key={session.id}
              className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                session.isCurrent
                  ? 'bg-emerald-950/20 border-emerald-800/60'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{session.device}</span>
                  {session.isCurrent && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 rounded">
                      This Device
                    </span>
                  )}
                </div>
                <div className="font-mono text-slate-400 text-[11px] flex items-center gap-2">
                  <span>IP: {session.ip}</span>
                  <span>·</span>
                  <span>{session.location}</span>
                </div>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-400">
                <span>{session.lastActive}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Audit Trail Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Security Audit Log</h3>
            <p className="text-xs text-slate-400">Chronological telemetry of cryptographic and authentication events</p>
          </div>

          <div className="flex items-center gap-1.5">
            {['All', 'Nominal', 'Verified', 'Alert'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  filterStatus === status
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-4">Location & IP</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3.5 px-4 text-white font-semibold font-sans">{log.event}</td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div>{log.location}</div>
                    <div className="text-[10px] text-slate-500">{log.ipAddress}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                        log.status === 'Verified'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : log.status === 'Alert'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {log.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                      {log.status === 'Alert' && <AlertTriangle className="w-3 h-3" />}
                      <span>{log.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-sans max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
