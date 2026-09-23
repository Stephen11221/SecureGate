import React, { useState } from 'react';
import { Post, Story, PostCryptoMeta, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { encryptText } from '../../utils/crypto';
import { StoryViewerModal } from './StoryViewerModal';
import { CryptoPayloadModal } from './CryptoPayloadModal';
import { VerificationBadge } from '../ui/VerificationBadge';
import {
  Heart,
  MessageSquare,
  Bookmark,
  ShieldCheck,
  Lock,
  Code2,
  Copy,
  Check,
  Send,
  PlusCircle,
  Radio,
  Image as ImageIcon,
  MapPin,
  Briefcase
} from 'lucide-react';

interface FeedViewProps {
  posts: Post[];
  stories: Story[];
  onAddPost: (post: Post) => void;
  onUpdatePost: (post: Post) => void;
  onHireAuthor?: (author: Post['author']) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ posts, stories, onAddPost, onUpdatePost, onHireAuthor }) => {
  const { user, addToast } = useAuth();
  
  // Stories Modal State
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Crypto Payload Modal State
  const [activeCryptoMeta, setActiveCryptoMeta] = useState<{ meta: PostCryptoMeta; title: string } | null>(null);

  // Post Composer State
  const [showComposer, setShowComposer] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [includeCode, setIncludeCode] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [codeFilename, setCodeFilename] = useState('exploit_poc.py');
  const [codeBody, setCodeBody] = useState('');
  const [postLocation, setPostLocation] = useState('Westlands, Nairobi');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Active expanded comments
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const sampleImages = [
    { label: 'FinTech Packet Audit', url: '/src/assets/images/feed_ke_fintech_audit_1790143328577.jpg' },
    { label: 'Satellite Telemetry', url: '/src/assets/images/feed_satellite_telemetry_1790143345677.jpg' },
    { label: 'Hardware Probing Lab', url: '/src/assets/images/feed_hardware_hacking_1790143359047.jpg' }
  ];

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setIsEncrypting(true);
    try {
      // Real client-side encryption via Web Crypto API
      const fullTextToSeal = postContent + (codeBody ? `\n\nCODE:\n${codeBody}` : '');
      const cryptoResult = await encryptText(fullTextToSeal);

      const newPost: Post = {
        id: 'post_' + Math.random().toString(36).substring(2, 9),
        author: {
          id: user?.id || 'usr_banner_01',
          name: user?.fullName || 'Banner Mwangi',
          handle: user?.handle || '@banner_sec',
          avatar: user?.avatar || '/src/assets/images/avatar_cyber_kenya_1790143371413.jpg',
          role: user?.role || 'Fintech Security Architect',
          verified: true,
          location: postLocation
        },
        timestamp: 'Just now',
        content: postContent,
        image: selectedImage || undefined,
        codeSnippet: includeCode && codeBody ? {
          language: codeLanguage,
          filename: codeFilename,
          code: codeBody
        } : undefined,
        likes: 1,
        userLiked: true,
        bookmarks: 0,
        userBookmarked: false,
        comments: [],
        tags: ['KenyaSec', 'Research', 'E2EE', postLocation.split(',')[0].replace(/\s+/g, '')],
        cryptoMeta: {
          algorithm: cryptoResult.algorithm,
          iv: cryptoResult.iv,
          authTag: cryptoResult.authTag,
          ciphertext: cryptoResult.ciphertext.slice(0, 120) + '...[ENCRYPTED]',
          sha256Hash: cryptoResult.sha256Hash,
          keyId: cryptoResult.keyId
        }
      };

      onAddPost(newPost);
      setPostContent('');
      setCodeBody('');
      setIncludeCode(false);
      setSelectedImage('');
      setShowComposer(false);

      addToast({
        type: 'success',
        title: 'Research Sealed & Published',
        message: `Post encrypted with AES-256-GCM. SHA-256 digest: ${cryptoResult.sha256Hash.slice(0, 16)}...`
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const toggleLike = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const isLiked = !!post.userLiked;
    onUpdatePost({
      ...post,
      likes: isLiked ? post.likes - 1 : post.likes + 1,
      userLiked: !isLiked
    });
  };

  const toggleBookmark = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const isBookmarked = !!post.userBookmarked;
    onUpdatePost({
      ...post,
      bookmarks: isBookmarked ? post.bookmarks - 1 : post.bookmarks + 1,
      userBookmarked: !isBookmarked
    });
    addToast({
      type: 'info',
      title: isBookmarked ? 'Removed from Vault' : 'Saved to Encrypted Vault',
      message: `Research post ${isBookmarked ? 'removed from' : 'archived into'} private offline storage.`
    });
  };

  const handleAddComment = (postId: string) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newComment = {
      id: 'cmt_' + Math.random().toString(36).substring(2, 7),
      author: {
        name: user?.fullName || 'Banner Mwangi',
        handle: user?.handle || '@banner_sec',
        avatar: user?.avatar || '/src/assets/images/avatar_cyber_kenya_1790143371413.jpg'
      },
      text: text,
      timestamp: 'Just now'
    };

    onUpdatePost({
      ...post,
      comments: [...post.comments, newComment]
    });

    setNewCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  const copyCodeToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* 1. INSTAGRAM-STYLE STORIES REEL */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold tracking-wide">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Kenya Recon Intel & Advisories</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Tap to inspect intel</span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          {stories.map((story, index) => (
            <button
              key={story.id}
              onClick={() => setActiveStoryIndex(index)}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-none"
            >
              <div className="relative p-0.5 rounded-full ring-2 ring-emerald-500/80 group-hover:ring-emerald-400 transition-all">
                <img
                  src={story.author.avatar}
                  alt={story.author.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-950 group-hover:scale-105 transition-transform"
                />
                {story.isOfficialKeCERT && (
                  <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-600 rounded-full text-white ring-2 ring-slate-950">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-slate-300 group-hover:text-white truncate max-w-[72px]">
                {story.author.handle.replace('@', '')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. RESEARCH COMPOSER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        {!showComposer ? (
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || '/src/assets/images/avatar_cyber_kenya_1790143371413.jpg'}
              alt="User"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
            />
            <button
              onClick={() => setShowComposer(true)}
              className="flex-1 text-left px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Publish encrypted research, CVE breakdown, or Kenya tech audit...
            </button>
            <button
              onClick={() => setShowComposer(true)}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
              title="New research post"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handlePublishPost} className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>New Cryptographically Sealed Dispatch</span>
              </span>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <textarea
              rows={3}
              required
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              placeholder="Detail your discovery, vulnerability writeup, or network architecture finding..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />

            {/* Optional Code Snippet toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIncludeCode(!includeCode)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    includeCode ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{includeCode ? 'Attached Code Block' : '+ Attach Code Snippet'}</span>
                </button>

                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={postLocation}
                    onChange={e => setPostLocation(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 text-[11px] focus:outline-none"
                  >
                    <option value="Westlands, Nairobi">Westlands, Nairobi</option>
                    <option value="Kilimani, Nairobi">Kilimani, Nairobi</option>
                    <option value="Nyali, Mombasa">Nyali, Mombasa</option>
                    <option value="Kisumu Hub">Kisumu Hub</option>
                    <option value="Eldoret Campus">Eldoret Campus</option>
                  </select>
                </div>
              </div>

              {includeCode && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codeFilename}
                      onChange={e => setCodeFilename(e.target.value)}
                      placeholder="filename.py"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none"
                    />
                    <select
                      value={codeLanguage}
                      onChange={e => setCodeLanguage(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none"
                    >
                      <option value="python">Python</option>
                      <option value="rust">Rust</option>
                      <option value="go">Go</option>
                      <option value="bash">Bash</option>
                      <option value="typescript">TypeScript</option>
                    </select>
                  </div>
                  <textarea
                    rows={4}
                    value={codeBody}
                    onChange={e => setCodeBody(e.target.value)}
                    placeholder="// Paste sanitized proof-of-concept or defense script here..."
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs font-mono text-emerald-300/90 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Select Image Attachment */}
            <div className="pt-1">
              <label className="text-[11px] text-slate-400 block mb-1">
                Attach Cyber Visual Capture:
              </label>
              <div className="flex flex-wrap gap-2">
                {sampleImages.map(img => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setSelectedImage(selectedImage === img.url ? '' : img.url)}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      selectedImage === img.url
                        ? 'bg-emerald-600 text-white font-medium'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{img.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-emerald-400/90">
                AES-256-GCM Hardware Encryption Enabled
              </span>
              <button
                type="submit"
                disabled={isEncrypting}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isEncrypting ? 'Encrypting Payload...' : 'Encrypt & Publish'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. POSTS FEED */}
      <div className="space-y-6">
        {posts.map(post => {
          const isCommentsOpen = !!expandedComments[post.id];
          return (
            <article
              key={post.id}
              className="bg-slate-900 border border-slate-800/90 rounded-xl overflow-hidden shadow-xl text-slate-200"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white tracking-wide">{post.author.name}</span>
                      <VerificationBadge verified={post.author.verified} level="KeCERT Elite" size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="font-mono">{post.author.handle}</span>
                      <span>·</span>
                      <span>{post.timestamp}</span>
                      <span>·</span>
                      <span className="text-slate-400">{post.author.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Hire Specialist Button */}
                  <button
                    type="button"
                    onClick={() => onHireAuthor?.(post.author)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-800/80 rounded hover:bg-cyan-900/60 transition-colors cursor-pointer"
                    title={`Hire ${post.author.name} for cybersecurity contract`}
                  >
                    <Briefcase className="w-3 h-3 text-cyan-400" />
                    <span>Hire</span>
                  </button>

                  {/* Inspect Crypto Payload Trigger */}
                  <button
                    type="button"
                    onClick={() => setActiveCryptoMeta({ meta: post.cryptoMeta, title: post.content.slice(0, 45) })}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded hover:bg-emerald-900/60 transition-colors cursor-pointer"
                    title="Inspect raw AES-256 payload & SHA-256 signature"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Verify Crypto</span>
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{post.content}</p>
              </div>

              {/* Optional Post Image */}
              {post.image && (
                <div className="w-full bg-slate-950 border-y border-slate-800/80 overflow-hidden">
                  <img
                    src={post.image}
                    alt="Research capture"
                    referrerPolicy="no-referrer"
                    className="w-full max-h-[460px] object-cover"
                  />
                </div>
              )}

              {/* Optional Code Snippet */}
              {post.codeSnippet && (
                <div className="mx-4 my-3 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden font-mono text-xs">
                  <div className="bg-slate-900/90 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{post.codeSnippet.filename}</span>
                      <span className="text-slate-600">/</span>
                      <span className="uppercase text-emerald-500/80">{post.codeSnippet.language}</span>
                    </div>
                    <button
                      onClick={() => copyCodeToClipboard(post.codeSnippet!.code, post.id)}
                      className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedCodeId === post.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 text-[11px] text-slate-200 overflow-x-auto leading-relaxed bg-slate-950/70">
                    <code>{post.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Tags without pills (Anti-Slop Zero-Pill discipline) */}
              <div className="px-4 py-2 flex flex-wrap items-center gap-2 text-[11px] text-emerald-400/90 font-mono">
                {post.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    <span>#{tag}</span>
                    {idx < post.tags.length - 1 && <span className="text-slate-600">·</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* Post Action Bar */}
              <div className="px-4 py-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      post.userLiked ? 'text-red-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-current text-red-500' : ''}`} />
                    <span className="font-mono tabular-nums">{post.likes}</span>
                  </button>

                  <button
                    onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !isCommentsOpen }))}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-mono tabular-nums">{post.comments.length}</span>
                  </button>
                </div>

                <button
                  onClick={() => toggleBookmark(post.id)}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    post.userBookmarked ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Bookmark to local vault"
                >
                  <Bookmark className={`w-4 h-4 ${post.userBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Comments drawer */}
              {isCommentsOpen && (
                <div className="p-4 bg-slate-950/70 border-t border-slate-800/80 space-y-3">
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {post.comments.length === 0 ? (
                      <div className="text-xs text-slate-500 italic py-2">
                        No replies yet. Start the encrypted peer discussion.
                      </div>
                    ) : (
                      post.comments.map(c => (
                        <div key={c.id} className="text-xs flex items-start gap-2.5">
                          <img
                            src={c.author.avatar}
                            alt={c.author.name}
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover mt-0.5 border border-slate-700"
                          />
                          <div className="flex-1 bg-slate-900/80 border border-slate-800 rounded-lg p-2.5">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-semibold text-slate-200">{c.author.name}</span>
                              <span className="text-slate-500 font-mono">{c.timestamp}</span>
                            </div>
                            <p className="text-slate-300 leading-normal">{c.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment input */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newCommentText[post.id] || ''}
                      onChange={e => setNewCommentText({ ...newCommentText, [post.id]: e.target.value })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                      placeholder="Write an encrypted peer reply..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddComment(post.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs cursor-pointer transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Stories Fullscreen / Modal Viewer */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}

      {/* Crypto Payload Inspector Modal */}
      {activeCryptoMeta && (
        <CryptoPayloadModal
          cryptoMeta={activeCryptoMeta.meta}
          postTitle={activeCryptoMeta.title}
          onClose={() => setActiveCryptoMeta(null)}
        />
      )}

    </div>
  );
};
