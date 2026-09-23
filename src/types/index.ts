export interface User {
  id: string;
  username: string;
  handle: string;
  fullName: string;
  avatar: string;
  bio: string;
  location: string; // e.g. "Nairobi, KE", "Mombasa, KE"
  role: 'Core Security Researcher' | 'Red Team Specialist' | 'DFIR Analyst' | 'Cryptographer' | 'Fintech Security Architect';
  verified: boolean;
  phone: string; // e.g. "+254 712 345 678"
  pgpFingerprint: string;
  reputation: number;
  referralCode: string;
  referralsCount: number;
  joinedAt: string;
  is2FAEnabled: boolean;
  isAdmin?: boolean;
  faceScanVerified?: boolean;
  phoneVerified?: boolean;
  verificationLevel?: 'KeCERT Elite' | 'Biometric Verified' | 'Core Specialist';
  hourlyRateKes?: string;
  availableForHire?: boolean;
}

export interface Story {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  title: string;
  type: 'advisory' | 'exploit_analysis' | 'recon' | 'hardware';
  timestamp: string;
  previewSnippet: string;
  fullContent: string;
  image?: string;
  isOfficialKeCERT?: boolean;
}

export interface PostCryptoMeta {
  algorithm: string;
  iv: string;
  authTag: string;
  ciphertext: string;
  sha256Hash: string;
  keyId: string;
}

export interface PostComment {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    role: string;
    verified: boolean;
    location: string;
  };
  timestamp: string;
  content: string;
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
  image?: string;
  likes: number;
  userLiked?: boolean;
  bookmarks: number;
  userBookmarked?: boolean;
  comments: PostComment[];
  tags: string[];
  cryptoMeta: PostCryptoMeta;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  plaintext: string;
  ciphertext: string;
  iv: string;
  authTag: string;
  timestamp: string;
  isDelivered: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  category: 'Web Exploitation' | 'Reverse Engineering' | 'Cryptography' | 'Network Forensics' | 'FinTech KE';
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Elite';
  description: string;
  author: string;
  solvedCount: number;
  hints: string[];
  artifactSnippet?: {
    name: string;
    content: string;
  };
  flagAnswer: string; // validated client-side with SHA-256 or string match
  userSolved?: boolean;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  handle: string;
  avatar: string;
  location: string;
  score: number;
  challengesSolved: number;
  badge: string;
}

export interface CodingResource {
  id: string;
  title: string;
  category: 'Defensive & Hardening' | 'Offensive & Exploitation' | 'Web3 & FinTech Security' | 'Network & Scada' | 'Incident Response';
  language: 'Python' | 'Bash' | 'Go' | 'Rust' | 'TypeScript';
  description: string;
  author: {
    name: string;
    handle: string;
  };
  code: string;
  simulatedOutput?: string;
  downloads: number;
  stars: number;
  userStarred?: boolean;
  tags: string[];
  updatedAt: string;
}

export interface ForumReply {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    role: string;
  };
  content: string;
  codeSnippet?: string;
  timestamp: string;
  upvotes: number;
  userUpvoted?: boolean;
  isVerifiedFix?: boolean;
}

export interface ForumThread {
  id: string;
  channel: 'incident-response' | 'fintech-security-ke' | 'reverse-engineering' | 'zero-day-advisories' | 'hardware-sec';
  title: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    role: string;
  };
  content: string;
  codeSnippet?: string;
  tags: string[];
  timestamp: string;
  upvotes: number;
  userUpvoted?: boolean;
  replies: ForumReply[];
  isSolved: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  ipAddress: string;
  location: string;
  device: string;
  status: 'Nominal' | 'Alert' | 'Verified';
  details: string;
  userHandle?: string;
  authMethod?: 'Phone OTP + Face Scan' | 'Hardware Passkey' | 'Referral Key Handshake' | 'Biometric Liveness';
  biometricScore?: string;
  isLoginEvent?: boolean;
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  sizeKb: number;
  sha256Hash: string;
  itemsCount: {
    posts: number;
    messages: number;
    challengesSolved: number;
    savedResources: number;
  };
  status: 'Encrypted & Stored' | 'Verified';
  backedByHandle?: string;
  encryptionAlgorithm?: string;
}

export interface ReferralRecord {
  code: string;
  createdBy: string;
  createdAt: string;
  usedBy?: string;
  claimed: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Red Team Bounty' | 'Incident Retainer';
  salaryKes: string;
  category: 'FinTech Security' | 'Penetration Testing' | 'Cloud & DevSecOps' | 'DFIR & SOC' | 'SCADA & Infrastructure';
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedBy: {
    name: string;
    handle: string;
    verified: boolean;
  };
  postedAt: string;
  urgent?: boolean;
  applicantsCount: number;
}

export interface HireProposal {
  id: string;
  specialistId: string;
  specialistName: string;
  specialistHandle: string;
  clientName: string;
  clientHandle: string;
  projectTitle: string;
  engagementType: 'Vulnerability Audit' | 'Red Team Exercise' | 'Incident Response (Urgent)' | 'Fintech Smart Contract' | 'Security Architecture Advisory';
  budgetKes: string;
  timeline: string;
  scopeDescription: string;
  status: 'Pending Review' | 'Accepted' | 'In Progress' | 'Completed';
  createdAt: string;
}

