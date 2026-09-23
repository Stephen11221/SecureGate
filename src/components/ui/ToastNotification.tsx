import React from 'react';
import { useAuth, SecurityToast } from '../../context/AuthContext';
import { ShieldCheck, MessageSquare, AlertTriangle, Info, X, Copy, Check } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { activeToasts, dismissToast } = useAuth();

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {activeToasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: SecurityToast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const [copied, setCopied] = React.useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'sms_otp':
        return <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'security_alert':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'success':
        return <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="pointer-events-auto bg-slate-900 border border-slate-700/80 shadow-2xl rounded-lg p-3.5 text-slate-200 transition-all transform animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-semibold text-slate-100 tracking-wide">{toast.title}</h4>
            <span className="text-[11px] font-mono tabular-nums text-slate-400">{toast.timestamp}</span>
          </div>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed break-words">{toast.message}</p>
          
          {toast.codeSnippet && (
            <div className="mt-2 flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-sm">
              <span className="text-emerald-400 font-bold tracking-widest">{toast.codeSnippet}</span>
              <button
                type="button"
                onClick={() => copyCode(toast.codeSnippet!)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy OTP'}</span>
              </button>
            </div>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
