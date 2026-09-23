import React, { useState } from 'react';
import { User, DirectMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { encryptText } from '../../utils/crypto';
import {
  Lock,
  Send,
  ShieldCheck,
  Search,
  KeyRound,
  Eye,
  EyeOff,
  User as UserIcon,
  CheckCheck
} from 'lucide-react';

interface EncryptedCommsViewProps {
  specialists: User[];
  messages: DirectMessage[];
  onSendMessage: (msg: DirectMessage) => void;
}

export const EncryptedCommsView: React.FC<EncryptedCommsViewProps> = ({
  specialists,
  messages,
  onSendMessage
}) => {
  const { user, addToast } = useAuth();
  const [selectedSpecialist, setSelectedSpecialist] = useState<User>(specialists[0]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRawCrypto, setShowRawCrypto] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Filter specialists
  const filteredSpecialists = specialists.filter(
    s =>
      s.id !== user?.id &&
      (s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Messages between current user and selected specialist
  const activeConversation = messages.filter(
    m =>
      (m.senderId === user?.id && m.receiverId === selectedSpecialist.id) ||
      (m.senderId === selectedSpecialist.id && m.receiverId === user?.id)
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsEncrypting(true);
    const plaintext = inputText.trim();
    setInputText('');

    try {
      // Real Web Crypto AES-256-GCM encryption
      const encrypted = await encryptText(plaintext);

      const newMsg: DirectMessage = {
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        senderId: user?.id || 'usr_banner_01',
        receiverId: selectedSpecialist.id,
        plaintext,
        ciphertext: encrypted.ciphertext.slice(0, 48) + '...[AES-GCM]',
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDelivered: true
      };

      onSendMessage(newMsg);

      // Automated peer response simulation
      setTimeout(async () => {
        const responses: Record<string, string> = {
          usr_wanjiku_02: 'Acknowledged. I verified the Kyber-768 parameters against our Nairobi edge node. The lattice key exchange is stable.',
          usr_omondi_03: 'Received on my terminal. I will test the SCADA register bypass on our isolated Kisumu testbed and report back.',
          usr_amina_04: 'Copy that. Updating the coastal threat ledger now. Stand by for the PCAP artifact.',
          usr_kiprono_05: 'Got it. Pushing the updated eBPF filter rule to our cluster proxies.',
          usr_kecert_06: 'Threat dispatch logged. National KeCERT incident coordination ticket #KE-2026-9041 created.'
        };

        const replyText = responses[selectedSpecialist.id] || 'Encrypted message received and authenticated via PGP key.';
        const encReply = await encryptText(replyText);

        const replyMsg: DirectMessage = {
          id: 'msg_' + Math.random().toString(36).substring(2, 9),
          senderId: selectedSpecialist.id,
          receiverId: user?.id || 'usr_banner_01',
          plaintext: replyText,
          ciphertext: encReply.ciphertext.slice(0, 48) + '...[AES-GCM]',
          iv: encReply.iv,
          authTag: encReply.authTag,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDelivered: true
        };

        onSendMessage(replyMsg);
        addToast({
          type: 'info',
          title: `Encrypted Response from ${selectedSpecialist.handle}`,
          message: replyText
        });
      }, 1500);

    } catch (err) {
      console.error(err);
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl h-[700px] flex flex-col md:flex-row text-slate-200">
      
      {/* Left Column: Kenyan Specialists Directory */}
      <div className="w-full md:w-80 border-r border-slate-800 bg-slate-950/60 flex flex-col shrink-0">
        
        <div className="p-3.5 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Specialist Directory</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-1.5 py-0.5 rounded">
              E2EE Active
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Kenyan specialists..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredSpecialists.map(specialist => {
            const isSelected = selectedSpecialist.id === specialist.id;
            return (
              <button
                key={specialist.id}
                onClick={() => setSelectedSpecialist(specialist)}
                className={`w-full p-3 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                  isSelected ? 'bg-slate-900/90 border-l-2 border-emerald-400' : 'hover:bg-slate-900/40'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={specialist.avatar}
                    alt={specialist.fullName}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white truncate">{specialist.fullName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{specialist.location.split(',')[0]}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400/90 font-mono truncate">{specialist.handle}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{specialist.role}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span>Zero-Knowledge Comms</span>
          <span className="text-emerald-400">P2P Mesh</span>
        </div>
      </div>

      {/* Right Column: Encrypted Chat Stream */}
      <div className="flex-1 flex flex-col bg-slate-900/40">
        
        {/* Chat Header */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedSpecialist.avatar}
              alt={selectedSpecialist.fullName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{selectedSpecialist.fullName}</span>
                <span className="text-[11px] font-mono text-emerald-400">{selectedSpecialist.handle}</span>
                {selectedSpecialist.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>{selectedSpecialist.role}</span>
                <span>·</span>
                <span>{selectedSpecialist.location}</span>
                <span>·</span>
                <span className="text-slate-500 truncate max-w-[140px]">
                  PGP: {selectedSpecialist.pgpFingerprint.slice(0, 9)}...
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowRawCrypto(!showRawCrypto)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors cursor-pointer border ${
              showRawCrypto
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
            title="Inspect raw AES-GCM ciphertext payload and IV"
          >
            {showRawCrypto ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="font-mono text-[11px]">
              {showRawCrypto ? 'Ciphertext Mode' : 'Inspect Ciphertext'}
            </span>
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-[11px] text-slate-400 font-mono">
              <KeyRound className="w-3 h-3 text-emerald-400" />
              <span>AES-256-GCM Channel established with {selectedSpecialist.handle}</span>
            </div>
          </div>

          {activeConversation.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No prior messages with this specialist. All outgoing dispatches are sealed in volatile RAM.
            </div>
          ) : (
            activeConversation.map(msg => {
              const isMe = msg.senderId === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md rounded-xl p-3 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-950'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-none'
                    }`}
                  >
                    {showRawCrypto ? (
                      <div className="font-mono text-[11px] space-y-1 bg-slate-950/80 p-2 rounded text-emerald-300 break-all select-all">
                        <div className="text-[10px] text-slate-400">IV: {msg.iv}</div>
                        <div>CIPHERTEXT: {msg.ciphertext}</div>
                        <div className="text-[10px] text-slate-500">TAG: {msg.authTag}</div>
                      </div>
                    ) : (
                      <p className="break-words">{msg.plaintext}</p>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={`Message ${selectedSpecialist.handle} securely (AES-256-GCM)...`}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isEncrypting || !inputText.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

      </div>
    </div>
  );
};
