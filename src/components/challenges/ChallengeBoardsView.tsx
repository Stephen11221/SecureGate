import React, { useState } from 'react';
import { Challenge, LeaderboardUser } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Flag,
  Trophy,
  CheckCircle2,
  FileCode,
  HelpCircle,
  Award,
  ChevronRight,
  Copy,
  Check,
  Search,
  Filter
} from 'lucide-react';

interface ChallengeBoardsViewProps {
  challenges: Challenge[];
  leaderboard: LeaderboardUser[];
  onSolveChallenge: (challengeId: string) => void;
}

export const ChallengeBoardsView: React.FC<ChallengeBoardsViewProps> = ({
  challenges,
  leaderboard,
  onSolveChallenge
}) => {
  const { user, addToast } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [copiedArtifact, setCopiedArtifact] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard'>('challenges');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'FinTech KE', 'Web Exploitation', 'Reverse Engineering', 'Cryptography', 'Network Forensics'];

  const filteredChallenges = challenges.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleFlagSubmit = (challenge: Challenge, e: React.FormEvent) => {
    e.preventDefault();
    const input = (flagInputs[challenge.id] || '').trim();

    if (!input) return;

    if (input.toLowerCase() === challenge.flagAnswer.toLowerCase()) {
      onSolveChallenge(challenge.id);
      addToast({
        type: 'success',
        title: 'FLAG CAPTURED! Points Credited',
        message: `Challenge "${challenge.title}" solved! +${challenge.points} reputation points added to your profile.`
      });
      setFlagInputs(prev => ({ ...prev, [challenge.id]: '' }));
    } else {
      addToast({
        type: 'security_alert',
        title: 'Invalid Flag Submission',
        message: `The submitted flag payload did not match the challenge cryptographic challenge signature.`
      });
    }
  };

  const copyArtifactContent = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedArtifact(id);
    setTimeout(() => setCopiedArtifact(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Flag className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">Kenyan Cyber Defense Challenge Boards</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-world security scenarios grounded in East African banking APIs, subsea fiber, and critical systems.
          </p>
        </div>

        {/* View Switcher: Challenges vs Leaderboard */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'challenges' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Challenges ({challenges.length})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'leaderboard' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>
        </div>
      </div>

      {activeTab === 'challenges' ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search challenges..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChallenges.map(challenge => {
              const isSolved = !!challenge.userSolved;
              const isHintOpen = !!revealedHints[challenge.id];

              return (
                <div
                  key={challenge.id}
                  className={`bg-slate-900 border rounded-xl p-5 shadow-lg flex flex-col justify-between transition-colors ${
                    isSolved ? 'border-emerald-800/80 bg-slate-900/90' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Top Row: Category & Points */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-mono font-medium">{challenge.category}</span>
                        <span className="text-slate-600">·</span>
                        <span
                          className={`font-mono text-[11px] ${
                            challenge.difficulty === 'Easy'
                              ? 'text-cyan-400'
                              : challenge.difficulty === 'Medium'
                              ? 'text-amber-400'
                              : challenge.difficulty === 'Hard'
                              ? 'text-orange-400'
                              : 'text-red-400'
                          }`}
                        >
                          {challenge.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-white font-bold">{challenge.points} PTS</span>
                        {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white tracking-tight">{challenge.title}</h3>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-sans">{challenge.description}</p>

                    {/* Artifact Snippet / Code block */}
                    {challenge.artifactSnippet && (
                      <div className="mt-3 bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-[11px]">
                        <div className="flex items-center justify-between text-slate-400 pb-1 mb-1 border-b border-slate-800/60 text-[10px]">
                          <span className="flex items-center gap-1">
                            <FileCode className="w-3 h-3 text-emerald-400" />
                            {challenge.artifactSnippet.name}
                          </span>
                          <button
                            onClick={() => copyArtifactContent(challenge.artifactSnippet!.content, challenge.id)}
                            className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                          >
                            {copiedArtifact === challenge.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedArtifact === challenge.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="text-slate-300 whitespace-pre-wrap break-all leading-normal text-[11px]">
                          {challenge.artifactSnippet.content}
                        </pre>
                      </div>
                    )}

                    {/* Hints Drawer */}
                    {challenge.hints && challenge.hints.length > 0 && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => setRevealedHints(prev => ({ ...prev, [challenge.id]: !isHintOpen }))}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>{isHintOpen ? 'Hide Challenge Hint' : 'Reveal Tactical Hint'}</span>
                        </button>
                        {isHintOpen && (
                          <div className="mt-1.5 p-2.5 bg-amber-950/30 border border-amber-800/40 rounded text-xs text-amber-200/90 space-y-1">
                            {challenge.hints.map((hint, i) => (
                              <div key={i}>· {hint}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Flag Submission Row */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    {isSolved ? (
                      <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 rounded-lg flex items-center justify-between text-xs text-emerald-300">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Flag Captured & Authenticated</span>
                        </span>
                        <span className="font-mono text-[11px] text-emerald-400/90">{challenge.flagAnswer}</span>
                      </div>
                    ) : (
                      <form onSubmit={e => handleFlagSubmit(challenge, e)} className="flex gap-2">
                        <input
                          type="text"
                          value={flagInputs[challenge.id] || ''}
                          onChange={e => setFlagInputs({ ...flagInputs, [challenge.id]: e.target.value })}
                          placeholder="flag{...}"
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Submit
                        </button>
                      </form>
                    )}

                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Author: {challenge.author}</span>
                      <span>Solved by {challenge.solvedCount} specialists</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* LEADERBOARD VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Kenya Ethical Hacker Hall of Fame</h3>
              <p className="text-xs text-slate-400">Rankings updated with real-time challenge captures</p>
            </div>
            <Award className="w-5 h-5 text-amber-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[11px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Specialist</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Solved</th>
                  <th className="py-3 px-4">Reputation Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {leaderboard.map(lb => {
                  const isCurrent = lb.id === user?.id;
                  return (
                    <tr
                      key={lb.id}
                      className={`hover:bg-slate-800/40 transition-colors ${isCurrent ? 'bg-emerald-950/20' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-bold">
                        {lb.rank === 1 ? (
                          <span className="text-amber-400 flex items-center gap-1">🥇 #1</span>
                        ) : lb.rank === 2 ? (
                          <span className="text-slate-300 flex items-center gap-1">🥈 #2</span>
                        ) : lb.rank === 3 ? (
                          <span className="text-amber-600 flex items-center gap-1">🥉 #3</span>
                        ) : (
                          <span>#{lb.rank}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={lb.avatar}
                            alt={lb.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1">
                              <span>{lb.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1 rounded">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-emerald-400 font-mono">{lb.handle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{lb.location}</td>
                      <td className="py-3.5 px-4 tabular-nums text-slate-300">{lb.challengesSolved} flags</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400 tabular-nums">{lb.score} PTS</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
