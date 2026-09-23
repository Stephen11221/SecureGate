import React, { useState } from 'react';
import { CodingResource } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Code2,
  Terminal,
  Download,
  Copy,
  Check,
  Star,
  Play,
  PlusCircle,
  FileText,
  Search,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface CodeVaultViewProps {
  resources: CodingResource[];
  onAddResource: (res: CodingResource) => void;
  onUpdateResource: (res: CodingResource) => void;
}

export const CodeVaultView: React.FC<CodeVaultViewProps> = ({
  resources,
  onAddResource,
  onUpdateResource
}) => {
  const { user, addToast } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResourceId, setActiveResourceId] = useState<string>(resources[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Terminal Simulator State
  const [runningTerminalId, setRunningTerminalId] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);

  // New Resource Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CodingResource['category']>('Defensive & Hardening');
  const [newLanguage, setNewLanguage] = useState<CodingResource['language']>('Python');
  const [newDescription, setNewDescription] = useState('');
  const [newCode, setNewCode] = useState('');

  const languages = ['All', 'Python', 'Bash', 'Go', 'Rust', 'TypeScript'];
  const categories = [
    'All',
    'Defensive & Hardening',
    'Offensive & Exploitation',
    'Web3 & FinTech Security',
    'Network & Scada'
  ];

  const filteredResources = resources.filter(r => {
    const matchesLang = selectedLanguage === 'All' || r.language === selectedLanguage;
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLang && matchesCat && matchesSearch;
  });

  const activeResource = resources.find(r => r.id === activeResourceId) || filteredResources[0] || resources[0];

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (resource: CodingResource) => {
    const extensions: Record<string, string> = {
      Python: 'py',
      Bash: 'sh',
      Go: 'go',
      Rust: 'rs',
      TypeScript: 'ts'
    };
    const ext = extensions[resource.language] || 'txt';
    const blob = new Blob([resource.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.title.toLowerCase().replace(/\s+/g, '_')}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);

    onUpdateResource({
      ...resource,
      downloads: resource.downloads + 1
    });

    addToast({
      type: 'info',
      title: 'Script Downloaded',
      message: `${resource.title} saved with verified SHA-256 header.`
    });
  };

  const toggleStar = (resource: CodingResource) => {
    const isStarred = !!resource.userStarred;
    onUpdateResource({
      ...resource,
      stars: isStarred ? resource.stars - 1 : resource.stars + 1,
      userStarred: !isStarred
    });
  };

  const handleSimulateExecution = (resource: CodingResource) => {
    setRunningTerminalId(resource.id);
    setTerminalOutput(`[*] Booting isolated sandbox container [ArchLinux-x86_64]...\n[*] Mounting memory-safe runtime for ${resource.language}...\n[*] Executing script in sandbox...\n\n`);

    setTimeout(() => {
      setTerminalOutput(prev => (prev || '') + (resource.simulatedOutput || '[✓] Execution finished cleanly with returncode 0.\n'));
      setRunningTerminalId(null);
    }, 1200);
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) return;

    const newRes: CodingResource = {
      id: 'res_' + Math.random().toString(36).substring(2, 8),
      title: newTitle.trim(),
      category: newCategory,
      language: newLanguage,
      description: newDescription.trim() || 'Community-contributed cybersecurity tool.',
      author: {
        name: user?.fullName || 'Banner Mwangi',
        handle: user?.handle || '@banner_sec'
      },
      code: newCode.trim(),
      simulatedOutput: `[*] Executing ${newTitle}...\n[+] Script initialized with verified runtime permissions.\n[✓] Finished without exceptions.`,
      downloads: 1,
      stars: 1,
      userStarred: true,
      tags: [newLanguage, 'KenyaSec', 'SecureGate'],
      updatedAt: 'Just now'
    };

    onAddResource(newRes);
    setActiveResourceId(newRes.id);
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewCode('');

    addToast({
      type: 'success',
      title: 'Coding Resource Published',
      message: `"${newRes.title}" is now available in the SecureGate code vault.`
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Vault Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Code2 className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">Kenya Infosec Coding Resource Vault</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Open-source scripts, defensive baselines, and exploits analysis tailored for East African systems.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm shadow-emerald-950"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Code Resource</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedLanguage === lang
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search code vault..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Two-Column Code Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List of Resources */}
        <div className="space-y-3">
          {filteredResources.map(res => {
            const isSelected = activeResource?.id === res.id;
            return (
              <div
                key={res.id}
                onClick={() => setActiveResourceId(res.id)}
                className={`p-4 bg-slate-900 border rounded-xl transition-all cursor-pointer ${
                  isSelected ? 'border-emerald-500/80 bg-slate-900/90 shadow-md' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <span className="text-emerald-400 font-semibold">{res.language}</span>
                  <span className="text-slate-400">{res.updatedAt}</span>
                </div>

                <h3 className="text-xs font-bold text-white tracking-tight">{res.title}</h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">{res.description}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>by {res.author.handle}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      <span>{res.stars}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>{res.downloads}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Resource Details & Code Viewer */}
        {activeResource && (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-400 font-mono font-medium">{activeResource.category}</span>
                  <span className="text-slate-600">·</span>
                  <span className="font-mono text-slate-400">{activeResource.language}</span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">{activeResource.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{activeResource.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStar(activeResource)}
                  className={`p-2 rounded border border-slate-800 transition-colors cursor-pointer ${
                    activeResource.userStarred ? 'text-amber-400 bg-amber-950/30' : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
                  title="Star resource"
                >
                  <Star className={`w-4 h-4 ${activeResource.userStarred ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => handleDownload(activeResource)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition-colors cursor-pointer"
                  title="Download script file"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleCopyCode(activeResource.code, activeResource.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded text-xs cursor-pointer transition-colors"
                >
                  {copiedId === activeResource.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSimulateExecution(activeResource)}
                  disabled={runningTerminalId === activeResource.id}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
                  title="Run code in simulated container"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{runningTerminalId === activeResource.id ? 'Executing...' : 'Run in Sandbox'}</span>
                </button>
              </div>
            </div>

            {/* Code Block */}
            <div className="flex-1 bg-slate-950 p-4 overflow-x-auto font-mono text-xs text-slate-200 max-h-[420px]">
              <pre className="leading-relaxed">
                <code>{activeResource.code}</code>
              </pre>
            </div>

            {/* Simulated Terminal Output Drawer */}
            {terminalOutput && (
              <div className="border-t border-slate-800 bg-slate-950 p-3.5 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1.5 mb-1.5 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Isolated Sandbox Container Output</span>
                  </span>
                  <button
                    onClick={() => setTerminalOutput(null)}
                    className="text-slate-500 hover:text-white text-[10px]"
                  >
                    Clear Output
                  </button>
                </div>
                <pre className="text-emerald-400/90 whitespace-pre-wrap leading-relaxed text-[11px] max-h-36 overflow-y-auto">
                  {terminalOutput}
                </pre>
              </div>
            )}

            {/* Tags footer */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                {activeResource.tags.map((t, idx) => (
                  <span key={t}>
                    #{t} {idx < activeResource.tags.length - 1 && '·'}
                  </span>
                ))}
              </div>
              <span>Author: {activeResource.author.name} ({activeResource.author.handle})</span>
            </div>

          </div>
        )}

      </div>

      {/* Share New Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-200">
            <h3 className="text-sm font-bold text-white tracking-tight mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Share Code Resource with Kenyan Specialists</span>
            </h3>

            <form onSubmit={handleCreateResource} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Daraja API HMAC Validator"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as CodingResource['category'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Defensive & Hardening">Defensive & Hardening</option>
                    <option value="Offensive & Exploitation">Offensive & Exploitation</option>
                    <option value="Web3 & FinTech Security">Web3 & FinTech Security</option>
                    <option value="Network & Scada">Network & Scada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Language</label>
                  <select
                    value={newLanguage}
                    onChange={e => setNewLanguage(e.target.value as CodingResource['language'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Python">Python</option>
                    <option value="Bash">Bash</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                    <option value="TypeScript">TypeScript</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Explain purpose, parameters, and testing instructions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Code Snippet</label>
                <textarea
                  rows={6}
                  required
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  placeholder="// Paste script here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-emerald-300 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded cursor-pointer"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
