import React, { useState } from 'react';
import { PostCryptoMeta } from '../../types';
import { X, Lock, Check, Copy, ShieldCheck, KeyRound } from 'lucide-react';

interface CryptoPayloadModalProps {
  cryptoMeta: PostCryptoMeta;
  postTitle: string;
  onClose: () => void;
}

export const CryptoPayloadModal: React.FC<CryptoPayloadModalProps> = ({ cryptoMeta, postTitle, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-200">
        
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Zero-Knowledge Cryptographic Envelope</h3>
              <p className="text-xs text-slate-400 truncate max-w-sm">Encrypted Payload for: &ldquo;{postTitle}&rdquo;</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs">
          
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Status: End-to-End Encrypted & Authenticated</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-400">{cryptoMeta.keyId}</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 text-slate-400">
              <span className="font-mono">Cipher Suite</span>
              <span className="text-[11px] font-mono text-emerald-400">{cryptoMeta.algorithm}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 text-slate-400">
              <span className="font-mono">Initialization Vector (96-bit IV)</span>
              <button
                onClick={() => copyToClipboard(cryptoMeta.iv, 'iv')}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedKey === 'iv' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'iv' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-300 break-all select-all">
              {cryptoMeta.iv}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 text-slate-400">
              <span className="font-mono">AEAD Authentication Tag (128-bit)</span>
              <button
                onClick={() => copyToClipboard(cryptoMeta.authTag, 'tag')}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedKey === 'tag' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'tag' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-300 break-all select-all">
              {cryptoMeta.authTag}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 text-slate-400">
              <span className="font-mono">SHA-256 Integrity Checksum</span>
              <button
                onClick={() => copyToClipboard(cryptoMeta.sha256Hash, 'hash')}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedKey === 'hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'hash' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-emerald-400 break-all select-all">
              {cryptoMeta.sha256Hash}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 text-slate-400">
              <span className="font-mono">Volatile AES Ciphertext Stream</span>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-slate-400 break-all max-h-24 overflow-y-auto">
              {cryptoMeta.ciphertext}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              PBKDF2 100,000 Key Derivation Iterations
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
