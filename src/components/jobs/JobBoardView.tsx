import React, { useState } from 'react';
import { Job, User, DirectMessage, HireProposal } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { VerificationBadge } from '../ui/VerificationBadge';
import { HireSpecialistModal } from '../hire/HireSpecialistModal';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  Send,
  PlusCircle,
  Building2,
  CheckCircle2,
  Lock,
  ChevronRight,
  Flame,
  UserCheck
} from 'lucide-react';

interface JobBoardViewProps {
  jobs: Job[];
  specialists: User[];
  onAddJob: (newJob: Job) => void;
  onSendMessage?: (msg: DirectMessage) => void;
}

export const JobBoardView: React.FC<JobBoardViewProps> = ({
  jobs,
  specialists,
  onAddJob,
  onSendMessage
}) => {
  const { user, addToast } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Hire Specialist modal state
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [selectedSpecialistForHire, setSelectedSpecialistForHire] = useState<User>(specialists[0]);

  // Post Job modal state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('Nairobi, KE (Hybrid)');
  const [newType, setNewType] = useState<Job['type']>('Full-time');
  const [newCategory, setNewCategory] = useState<Job['category']>('FinTech Security');
  const [newSalaryKes, setNewSalaryKes] = useState('KES 500,000 - 750,000 / mo');
  const [newDescription, setNewDescription] = useState('');
  const [newRequirements, setNewRequirements] = useState('');

  const categories = [
    'All',
    'FinTech Security',
    'Penetration Testing',
    'Cloud & DevSecOps',
    'DFIR & SOC',
    'SCADA & Infrastructure'
  ];

  const types = ['All', 'Full-time', 'Contract', 'Red Team Bounty', 'Incident Retainer'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesType = selectedType === 'All' || job.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleApply = (job: Job) => {
    if (appliedJobIds.includes(job.id)) return;

    setAppliedJobIds(prev => [...prev, job.id]);
    addToast({
      type: 'success',
      title: 'Verified Application Transmitted',
      message: `Your cryptographic profile, PGP key, and Verified Badge were submitted to ${job.company}.`
    });
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const job: Job = {
      id: 'job_' + Math.random().toString(36).substring(2, 9),
      title: newTitle.trim(),
      company: newCompany.trim(),
      location: newLocation,
      type: newType,
      category: newCategory,
      salaryKes: newSalaryKes.trim(),
      description: newDescription.trim(),
      requirements: newRequirements
        .split('\n')
        .map(r => r.trim())
        .filter(Boolean),
      responsibilities: [
        'Collaborate with Kenyan cybersecurity specialists on hardening protocols',
        'Participate in rapid triage and automated vulnerability disclosures'
      ],
      postedBy: {
        name: user?.fullName || 'Banner Mwangi',
        handle: user?.handle || '@banner_sec',
        verified: true
      },
      postedAt: 'Just now',
      urgent: false,
      applicantsCount: 0
    };

    onAddJob(job);
    setIsPostModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewCompany('');
    setNewDescription('');
    setNewRequirements('');

    addToast({
      type: 'success',
      title: 'Cyber Opportunity Published',
      message: `Listing for "${job.title}" is now active on the Kenyan Job Board.`
    });
  };

  const handleOpenHireSpecialist = (spec: User) => {
    setSelectedSpecialistForHire(spec);
    setIsHireModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                <Briefcase className="w-5 h-5" />
              </span>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Kenyan Cyber Specialists & Engineering Job Board
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-400 max-w-2xl font-sans">
              Verified high-security career opportunities, critical infrastructure defense contracts, and private bug bounties across Nairobi, Mombasa, and East Africa.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenHireSpecialist(specialists[0])}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-cyan-950 flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Hire Specialist</span>
            </button>

            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-emerald-950 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Cyber Job</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats banner */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
            <div className="text-slate-500 text-[10px] uppercase">Active Openings</div>
            <div className="text-sm font-bold text-white mt-0.5">{jobs.length} Positions</div>
          </div>
          <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
            <div className="text-slate-500 text-[10px] uppercase">Verified Employers</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">Safaricom, KeCERT, Banks</div>
          </div>
          <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
            <div className="text-slate-500 text-[10px] uppercase">Top Bounty Pool</div>
            <div className="text-sm font-bold text-cyan-400 mt-0.5">KES 2,000,000</div>
          </div>
          <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
            <div className="text-slate-500 text-[10px] uppercase">Identity Verification</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">1-Click PGP Match</div>
          </div>
        </div>
      </div>

      {/* Available Specialists for Direct Hire Carousel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Vetted Specialists Available for Direct Hire
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              Escrow Protected
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline-block">
            Directly contract top Kenyan hackers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {specialists.map(spec => (
            <div
              key={spec.id}
              className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src={spec.avatar}
                    alt={spec.fullName}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white truncate">{spec.fullName}</span>
                      <VerificationBadge verified={spec.verified} level={spec.verificationLevel} size="sm" />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">{spec.handle}</div>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-400/90 font-medium truncate mb-1">
                  {spec.role}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {spec.location.split(',')[0]} · {spec.hourlyRateKes || 'KES 8,500 / hr'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenHireSpecialist(spec)}
                className="mt-3 w-full py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Hire {spec.handle.split('_')[0]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search roles, skills (Daraja, SCADA, eBPF, Volatility), or companies..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer text-xs ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Type Filter */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-mono text-[11px]">Engagement Type:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                selectedType === t
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Listing Container */}
      <div className="space-y-3.5">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No matching cyber openings found</div>
            <p className="text-xs text-slate-500">
              Try adjusting your search keywords or clear category filters.
            </p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const isApplied = appliedJobIds.includes(job.id);
            const isExpanded = expandedJobId === job.id;

            return (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg hover:border-slate-700/80 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white tracking-tight hover:text-emerald-400 transition-colors">
                        {job.title}
                      </h3>
                      {job.urgent && (
                        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/80 font-semibold">
                          <Flame className="w-3 h-3" />
                          <span>Urgent</span>
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                        {job.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-sans">
                      <span className="flex items-center gap-1 font-semibold text-slate-200">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {job.postedAt}
                      </span>
                    </div>
                  </div>

                  {/* Compensation in KES */}
                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-xs sm:text-sm font-bold font-mono text-emerald-400">
                      {job.salaryKes}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {job.type} · {job.applicantsCount + (isApplied ? 1 : 0)} applicants
                    </div>
                  </div>
                </div>

                {/* Job Description excerpt */}
                <p className="text-xs text-slate-300/90 leading-relaxed font-sans">
                  {job.description}
                </p>

                {/* Expanded details (Requirements & Responsibilities) */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-150">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-1.5">
                        Key Requirements
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside font-sans">
                        {job.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-1.5">
                        Scope & Deliverables
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside font-sans">
                        {job.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Posted by: {job.postedBy.name} ({job.postedBy.handle})</span>
                      </div>
                      <VerificationBadge verified={job.postedBy.verified} size="sm" showLabel />
                    </div>
                  </div>
                )}

                {/* Card Action Row */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                    className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Full Brief & Requirements'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? '-rotate-90' : ''}`} />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenHireSpecialist(specialists[0])}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Hire Peer</span>
                    </button>

                    <button
                      onClick={() => handleApply(job)}
                      disabled={isApplied}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                        isApplied
                          ? 'bg-emerald-950 border border-emerald-700 text-emerald-300 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PGP Profile Submitted</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>1-Click Apply with Verified ID</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Post a Cyber Job Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Publish Cyber Role or Bounty
                  </h3>
                  <p className="text-xs text-slate-400">Reach verified Kenyan security researchers</p>
                </div>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job or Bounty Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Lead M-Pesa Security Engineer"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={e => setNewCompany(e.target.value)}
                    placeholder="e.g. NCBA Group, Safaricom"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="e.g. Nairobi, KE (Hybrid)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as Job['category'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="FinTech Security">FinTech Security</option>
                    <option value="Penetration Testing">Penetration Testing</option>
                    <option value="Cloud & DevSecOps">Cloud & DevSecOps</option>
                    <option value="DFIR & SOC">DFIR & SOC</option>
                    <option value="SCADA & Infrastructure">SCADA & Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Job Type
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as Job['type'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Red Team Bounty">Red Team Bounty</option>
                    <option value="Incident Retainer">Incident Retainer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Compensation (in KES / USD)
                </label>
                <input
                  type="text"
                  required
                  value={newSalaryKes}
                  onChange={e => setNewSalaryKes(e.target.value)}
                  placeholder="e.g. KES 600,000 / month or KES 1,500,000 Bounty"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brief Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Overview of the mission, technologies involved..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Requirements (One per line)
                </label>
                <textarea
                  required
                  rows={2}
                  value={newRequirements}
                  onChange={e => setNewRequirements(e.target.value)}
                  placeholder="e.g. OSCP or equivalent&#10;Daraja API familiarity&#10;KeCERT verification"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="flex-1 py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-md shadow-emerald-950"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hire Specialist Engagement Modal */}
      <HireSpecialistModal
        specialist={selectedSpecialistForHire}
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        onProposalSent={(_proposal, dm) => {
          if (onSendMessage) {
            onSendMessage(dm);
          }
        }}
      />

    </div>
  );
};
