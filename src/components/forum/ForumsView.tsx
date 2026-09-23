import React, { useState } from 'react';
import { ForumThread, ForumReply } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  PlusCircle,
  Hash,
  Search,
  Code2,
  Send,
  ShieldCheck
} from 'lucide-react';

interface ForumsViewProps {
  threads: ForumThread[];
  onAddThread: (thread: ForumThread) => void;
  onUpdateThread: (thread: ForumThread) => void;
}

export const ForumsView: React.FC<ForumsViewProps> = ({ threads, onAddThread, onUpdateThread }) => {
  const { user, addToast } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reply form state
  const [replyContent, setReplyContent] = useState('');
  const [replyCode, setReplyCode] = useState('');
  const [showReplyCode, setShowReplyCode] = useState(false);

  // New Thread modal state
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState<ForumThread['channel']>('fintech-security-ke');
  const [newContent, setNewContent] = useState('');
  const [newCode, setNewCode] = useState('');

  const channels = [
    { id: 'all', name: 'all-channels', label: 'All Discussions' },
    { id: 'fintech-security-ke', name: 'fintech-security-ke', label: 'FinTech KE Sec' },
    { id: 'incident-response', name: 'incident-response', label: 'Incident Response' },
    { id: 'reverse-engineering', name: 'reverse-engineering', label: 'Reverse Engineering' },
    { id: 'zero-day-advisories', name: 'zero-day-advisories', label: 'Zero-Day Advisories' },
    { id: 'hardware-sec', name: 'hardware-sec', label: 'Hardware & IoT' }
  ];

  const filteredThreads = threads.filter(t => {
    const matchesChannel = selectedChannel === 'all' || t.channel === selectedChannel;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesChannel && matchesSearch;
  });

  const activeThread = threads.find(t => t.id === activeThreadId) || filteredThreads[0] || threads[0];

  const handleVoteThread = (thread: ForumThread) => {
    const isUpvoted = !!thread.userUpvoted;
    onUpdateThread({
      ...thread,
      upvotes: isUpvoted ? thread.upvotes - 1 : thread.upvotes + 1,
      userUpvoted: !isUpvoted
    });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !activeThread) return;

    const newReply: ForumReply = {
      id: 'rep_' + Math.random().toString(36).substring(2, 7),
      author: {
        name: user?.fullName || 'Banner Mwangi',
        handle: user?.handle || '@banner_sec',
        avatar: user?.avatar || '/src/assets/images/avatar_cyber_kenya_1790143371413.jpg',
        role: user?.role || 'Fintech Security Architect'
      },
      content: replyContent.trim(),
      codeSnippet: showReplyCode && replyCode ? replyCode.trim() : undefined,
      timestamp: 'Just now',
      upvotes: 0,
      userUpvoted: false
    };

    onUpdateThread({
      ...activeThread,
      replies: [...activeThread.replies, newReply]
    });

    setReplyContent('');
    setReplyCode('');
    setShowReplyCode(false);

    addToast({
      type: 'info',
      title: 'Reply Published',
      message: 'Your mitigation response is posted in #' + activeThread.channel
    });
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newThread: ForumThread = {
      id: 'forum_' + Math.random().toString(36).substring(2, 8),
      channel: newChannel,
      title: newTitle.trim(),
      author: {
        name: user?.fullName || 'Banner Mwangi',
        handle: user?.handle || '@banner_sec',
        avatar: user?.avatar || '/src/assets/images/avatar_cyber_kenya_1790143371413.jpg',
        role: user?.role || 'Fintech Security Architect'
      },
      content: newContent.trim(),
      codeSnippet: newCode ? newCode.trim() : undefined,
      tags: [newChannel.replace('-ke', ''), 'KenyaInfosec'],
      timestamp: 'Just now',
      upvotes: 1,
      userUpvoted: true,
      isSolved: false,
      replies: []
    };

    onAddThread(newThread);
    setActiveThreadId(newThread.id);
    setShowNewThreadModal(false);
    setNewTitle('');
    setNewContent('');
    setNewCode('');

    addToast({
      type: 'success',
      title: 'Discussion Thread Started',
      message: `Thread posted to #${newChannel}.`
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Forum Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">Secure Collaboration Forums</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Encrypted technical discourse, incident triage, and peer review for Kenya&apos;s computer specialists.
          </p>
        </div>

        <button
          onClick={() => setShowNewThreadModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm shadow-emerald-950"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Start Technical Thread</span>
        </button>
      </div>

      {/* Channel Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setSelectedChannel(ch.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                selectedChannel === ch.id
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Hash className="w-3 h-3" />
              <span>{ch.name}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Main Forum Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Thread List */}
        <div className="space-y-3">
          {filteredThreads.map(thread => {
            const isSelected = activeThread?.id === thread.id;
            return (
              <div
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`p-4 bg-slate-900 border rounded-xl transition-all cursor-pointer ${
                  isSelected ? 'border-emerald-500/80 bg-slate-900/90 shadow-md' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {thread.channel}
                  </span>
                  <span className="text-slate-400">{thread.timestamp}</span>
                </div>

                <h3 className="text-xs font-bold text-white tracking-tight">{thread.title}</h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">{thread.content}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>{thread.author.handle}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-slate-400" />
                      <span>{thread.upvotes}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{thread.replies.length}</span>
                    </span>
                    {thread.isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Thread Details & Reply Stream */}
        {activeThread && (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
            
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  {activeThread.channel}
                </span>
                <span className="text-slate-400 font-mono">{activeThread.timestamp}</span>
              </div>

              <h2 className="text-sm font-bold text-white tracking-tight">{activeThread.title}</h2>

              {/* Author badge */}
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={activeThread.author.avatar}
                  alt={activeThread.author.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
                />
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>{activeThread.author.name}</span>
                    <span className="text-[11px] font-mono text-emerald-400">{activeThread.author.handle}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{activeThread.author.role}</div>
                </div>
              </div>

              {/* Body */}
              <div className="mt-3 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {activeThread.content}
              </div>

              {/* Attached Code */}
              {activeThread.codeSnippet && (
                <div className="mt-3 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-emerald-300 overflow-x-auto">
                  <pre>
                    <code>{activeThread.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Upvote & Action Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleVoteThread(activeThread)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer border ${
                    activeThread.userUpvoted
                      ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono tabular-nums">{activeThread.upvotes} Upvotes</span>
                </button>

                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  {activeThread.tags.map(t => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Replies Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[380px]">
              <div className="text-xs font-semibold text-slate-300 mb-2">
                Peer Responses ({activeThread.replies.length})
              </div>

              {activeThread.replies.map(reply => (
                <div
                  key={reply.id}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-2 ${
                    reply.isVerifiedFix
                      ? 'bg-emerald-950/20 border-emerald-700/80 shadow-sm'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <img
                        src={reply.author.avatar}
                        alt={reply.author.name}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover border border-slate-700"
                      />
                      <span className="font-semibold text-white">{reply.author.name}</span>
                      <span className="text-slate-400 font-mono">{reply.author.handle}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {reply.isVerifiedFix && (
                        <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Fix</span>
                        </span>
                      )}
                      <span className="text-slate-500 font-mono">{reply.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-slate-300 font-sans">{reply.content}</p>

                  {reply.codeSnippet && (
                    <div className="bg-slate-950 border border-slate-800 rounded p-2.5 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                      <pre>
                        <code>{reply.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reply Composer Form */}
            <form onSubmit={handleSendReply} className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="Contribute technical insight or countermeasure..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowReplyCode(!showReplyCode)}
                  className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                    showReplyCode ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                  title="Attach code snippet to reply"
                >
                  <Code2 className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </div>

              {showReplyCode && (
                <textarea
                  rows={3}
                  value={replyCode}
                  onChange={e => setReplyCode(e.target.value)}
                  placeholder="// Paste fix snippet or Lua/Bash script here..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-emerald-300 text-xs focus:outline-none"
                />
              )}
            </form>

          </div>
        )}

      </div>

      {/* New Technical Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-200">
            <h3 className="text-sm font-bold text-white tracking-tight mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Start New Collaborative Thread</span>
            </h3>

            <form onSubmit={handleCreateThread} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Thread Subject / Question</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. BGP Route Origin Validation on Safaricom IP transit"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Discussion Channel</label>
                <select
                  value={newChannel}
                  onChange={e => setNewChannel(e.target.value as ForumThread['channel'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="fintech-security-ke">#fintech-security-ke</option>
                  <option value="incident-response">#incident-response</option>
                  <option value="reverse-engineering">#reverse-engineering</option>
                  <option value="zero-day-advisories">#zero-day-advisories</option>
                  <option value="hardware-sec">#hardware-sec</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Technical Breakdown</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Describe the vulnerability, network trace, or architectural issue..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Optional Code Snippet</label>
                <textarea
                  rows={3}
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  placeholder="// Paste trace or pseudo-code..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-emerald-300 text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded cursor-pointer"
                >
                  Post Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
