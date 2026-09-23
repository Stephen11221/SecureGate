import {
  User,
  Story,
  Post,
  DirectMessage,
  Challenge,
  LeaderboardUser,
  CodingResource,
  ForumThread,
  AuditLog,
  BackupSnapshot,
  Job,
  HireProposal
} from '../types';

export const INITIAL_USER: User = {
  id: 'usr_banner_01',
  username: 'bannermwangi',
  handle: '@banner_sec',
  fullName: 'Banner Mwangi',
  avatar: '/src/assets/images/avatar_cyber_kenya_1790143371413.jpg',
  bio: 'FinTech Security Architect & Red Teamer. Researching mobile payment security, eBPF telemetry, and resilient systems in Nairobi.',
  location: 'Nairobi, Kenya',
  role: 'Fintech Security Architect',
  verified: true,
  phone: '+254 722 890 254',
  pgpFingerprint: '9F82 41A7 E8B3 0021 D47E 8991 F5C0 254E',
  reputation: 2150,
  referralCode: 'SEC-KE-BANNER',
  referralsCount: 7,
  joinedAt: 'November 2025',
  is2FAEnabled: true,
  isAdmin: true,
  faceScanVerified: true,
  phoneVerified: true,
  verificationLevel: 'KeCERT Elite',
  hourlyRateKes: 'KES 8,500 / hr',
  availableForHire: true
};

export const OTHER_SPECIALISTS: User[] = [
  {
    id: 'usr_wanjiku_02',
    username: 'wanjiku_ndungu',
    handle: '@wanjiku_crypto',
    fullName: 'Dr. Wanjiku Ndung\'u',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Post-Quantum Cryptography researcher at University of Nairobi & Kilimani Cyber Lab. Lattice cryptography enthusiast.',
    location: 'Kilimani, Nairobi',
    role: 'Cryptographer',
    verified: true,
    phone: '+254 711 345 889',
    pgpFingerprint: '3C19 8812 BA40 9F20 1192 8821 DD34 9901',
    reputation: 2850,
    referralCode: 'SEC-KE-WANJIKU',
    referralsCount: 14,
    joinedAt: 'August 2025',
    is2FAEnabled: true,
    faceScanVerified: true,
    phoneVerified: true,
    verificationLevel: 'KeCERT Elite',
    hourlyRateKes: 'KES 10,000 / hr',
    availableForHire: true
  },
  {
    id: 'usr_omondi_03',
    username: 'brian_omondi',
    handle: '@omondi_red',
    fullName: 'Brian Omondi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Industrial Control Systems (ICS/SCADA) and critical infrastructure red teamer based in Kisumu. Port & power grid security.',
    location: 'Kisumu, Kenya',
    role: 'Red Team Specialist',
    verified: true,
    phone: '+254 733 912 445',
    pgpFingerprint: 'EE41 0029 A310 F8C1 2309 4581 0019 FC82',
    reputation: 2420,
    referralCode: 'SEC-KE-OMONDI',
    referralsCount: 9,
    joinedAt: 'September 2025',
    is2FAEnabled: true,
    faceScanVerified: true,
    phoneVerified: true,
    verificationLevel: 'Biometric Verified',
    hourlyRateKes: 'KES 9,000 / hr',
    availableForHire: true
  },
  {
    id: 'usr_amina_04',
    username: 'amina_omar',
    handle: '@amina_dfir',
    fullName: 'Amina Omar',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Digital Forensics & Incident Response lead. Deep memory forensics, maritime port cyber resilience in Mombasa.',
    location: 'Mombasa, Kenya',
    role: 'DFIR Analyst',
    verified: true,
    phone: '+254 701 445 778',
    pgpFingerprint: '55A9 9123 CC80 1289 E451 0938 3341 87AB',
    reputation: 1760,
    referralCode: 'SEC-KE-AMINA',
    referralsCount: 5,
    joinedAt: 'December 2025',
    is2FAEnabled: true,
    faceScanVerified: true,
    phoneVerified: true,
    verificationLevel: 'Biometric Verified',
    hourlyRateKes: 'KES 8,000 / hr',
    availableForHire: true
  },
  {
    id: 'usr_kiprono_05',
    username: 'kevin_kiprono',
    handle: '@kiprono_cloud',
    fullName: 'Kevin Kiprono',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Cloud Native security engineer & kernel telemetry specialist. Securing multi-region cloud workloads across East Africa.',
    location: 'Eldoret, Kenya',
    role: 'Core Security Researcher',
    verified: true,
    phone: '+254 728 554 112',
    pgpFingerprint: 'AA11 7733 5599 CC44 8822 1100 4488 2211',
    reputation: 1980,
    referralCode: 'SEC-KE-KIPRONO',
    referralsCount: 8,
    joinedAt: 'October 2025',
    is2FAEnabled: true,
    faceScanVerified: true,
    phoneVerified: true,
    verificationLevel: 'Biometric Verified',
    hourlyRateKes: 'KES 7,500 / hr',
    availableForHire: true
  },
  {
    id: 'usr_kecert_06',
    username: 'kecert_team',
    handle: '@kecert_official',
    fullName: 'National KeCERT Advisory',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    bio: 'Official threat intelligence dispatch desk for Kenya National Computer Incident Response Team Coordination Centre.',
    location: 'CA Centre, Nairobi',
    role: 'Core Security Researcher',
    verified: true,
    phone: '+254 20 4242 000',
    pgpFingerprint: '0000 KECERT 2540 0000 CA00 2026 KE00 9999',
    reputation: 9999,
    referralCode: 'KECERT-ALPHA',
    referralsCount: 150,
    joinedAt: 'January 2024',
    is2FAEnabled: true,
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_01',
    author: {
      name: 'National KeCERT',
      handle: '@kecert_official',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
    },
    title: 'Advisory: Kenyan SACCO Phishing Wave',
    type: 'advisory',
    timestamp: '28m ago',
    previewSnippet: 'Targeted spear-phishing campaigns mimicking CBK regulatory circulars.',
    fullContent: 'KeCERT has observed active spear-phishing targeting tier-2 financial SACCOs across Nairobi and Kiambu counties. Attackers deploy modified Cobalt Strike beacons masquerading as CBK compliance PDFs. Implement strict macro blocking and review perimeter proxy logs.',
    isOfficialKeCERT: true,
  },
  {
    id: 'story_02',
    author: {
      name: 'Banner Mwangi',
      handle: '@banner_sec',
      avatar: '/src/assets/images/avatar_cyber_kenya_1790143371413.jpg'
    },
    title: 'Daraja B2C Callback Timing Leak',
    type: 'exploit_analysis',
    timestamp: '1h ago',
    previewSnippet: 'Discovered a 120ms side-channel variance in callback signature checks.',
    fullContent: 'While auditing an asynchronous B2C payment gateway integration, we identified deterministic response timing variances during RSA signature verification. When invalid signatures are submitted, timing delta leaks key chunk alignment. Full writeup queued for peer review.',
    image: '/src/assets/images/feed_ke_fintech_audit_1790143328577.jpg',
  },
  {
    id: 'story_03',
    author: {
      name: 'Amina Omar',
      handle: '@amina_dfir',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    title: 'Mombasa Port Fiber Landing Telemetry',
    type: 'recon',
    timestamp: '3h ago',
    previewSnippet: 'SEACOM & TEAMS subsea fiber DWDM transponder firmware audit.',
    fullContent: 'Completed optical spectrum and management plane security audit on undersea cable landing interfaces along the Kenyan coastline. All legacy Telnet management ports have been sealed; MACsec layer 2 encryption verified active across all coastal metro rings.',
    image: '/src/assets/images/feed_satellite_telemetry_1790143345677.jpg',
  },
  {
    id: 'story_04',
    author: {
      name: 'Brian Omondi',
      handle: '@omondi_red',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    title: 'KPLC Smart Meter JTAG Probe',
    type: 'hardware',
    timestamp: '5h ago',
    previewSnippet: 'Extracted decrypted SPI flash firmware from prepaid power meters.',
    fullContent: 'Using a Saleae logic analyzer and OpenOCD via hardware test pads, we successfully extracted the STS token decryption routine from firmware version 3.12. Responsible disclosure submitted to the energy regulatory board.',
    image: '/src/assets/images/feed_hardware_hacking_1790143359047.jpg',
  },
  {
    id: 'story_05',
    author: {
      name: 'Dr. Wanjiku Ndung\'u',
      handle: '@wanjiku_crypto',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    title: 'Kyber-768 Implementation in Go',
    type: 'exploit_analysis',
    timestamp: '7h ago',
    previewSnippet: 'Benchmarked ML-KEM against standard ECDH on ARM64 Raspberry Pi 5.',
    fullContent: 'Benchmarking post-quantum key encapsulation mechanism ML-KEM-768 across local low-power edge nodes in Kenya. Performance hit is under 6% compared to X25519, proving readiness for national critical infrastructure deployment.',
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_01',
    author: {
      id: 'usr_banner_01',
      name: 'Banner Mwangi',
      handle: '@banner_sec',
      avatar: '/src/assets/images/avatar_cyber_kenya_1790143371413.jpg',
      role: 'Fintech Security Architect',
      verified: true,
      location: 'Westlands, Nairobi'
    },
    timestamp: '42m ago',
    content: 'Deep packet inspection audit of Kenyan digital banking APIs completed. We mapped out 14 microservice gateways processing STK Push callbacks. Found 3 endpoints vulnerable to nonce replay attacks if the timestamp window exceeds 180 seconds. Secure your HMAC digests and enforce strict Redis TTL locks on every checkout transaction ID.',
    image: '/src/assets/images/feed_ke_fintech_audit_1790143328577.jpg',
    codeSnippet: {
      language: 'python',
      filename: 'verify_stk_signature.py',
      code: `import hmac
import hashlib
import time

def verify_daraja_callback(raw_body: bytes, signature_header: str, secret: str, max_drift_sec: int = 120) -> bool:
    """Verifies timing-safe HMAC-SHA256 callback signature with anti-replay timestamp validation."""
    computed_hmac = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    # Prevent timing attack with constant-time comparison
    if not hmac.compare_digest(computed_hmac, signature_header):
        return False
    return True`
    },
    likes: 84,
    userLiked: true,
    bookmarks: 29,
    userBookmarked: false,
    comments: [
      {
        id: 'c1',
        author: {
          name: 'Dr. Wanjiku Ndung\'u',
          handle: '@wanjiku_crypto',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        },
        text: 'Crucial observation on the 180s drift window. In high latency rural cell towers, teams often bump TTL to 300s which exposes them to replay attacks. Redis atomic SETNX with 60s hard TTL is the gold standard.',
        timestamp: '35m ago'
      },
      {
        id: 'c2',
        author: {
          name: 'Kevin Kiprono',
          handle: '@kiprono_cloud',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
        },
        text: 'Adding this verification rule directly into our Envoy gateway filters in production today. Solid research!',
        timestamp: '18m ago'
      }
    ],
    tags: ['FinTechSec', 'DarajaAPI', 'NairobiInfosec', 'ZeroReplay', 'AES-256'],
    cryptoMeta: {
      algorithm: 'AES-256-GCM / PBKDF2-HMAC-SHA256',
      iv: '7f91a0c432be8812c31044bb',
      authTag: '88fa2904c100e47890dd2341ba0012ef',
      ciphertext: '4a9b7c81d2e0f5...[ENCRYPTED_PAYLOAD_8.4KB]',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      keyId: 'SG-NAIROBI-MESH-01'
    }
  },
  {
    id: 'post_02',
    author: {
      id: 'usr_amina_04',
      name: 'Amina Omar',
      handle: '@amina_dfir',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'DFIR Analyst',
      verified: true,
      location: 'Nyali, Mombasa'
    },
    timestamp: '2h ago',
    content: 'Reviewing satellite telemetry uplink ground stations and coastal undersea cable interconnects. As Kenya expands direct satellite IoT infrastructure for remote wildlife conservancies and marine tracking, securing unauthenticated telemetry downlinks is mandatory. Never transmit plaintext telemetry over 433MHz / L-band.',
    image: '/src/assets/images/feed_satellite_telemetry_1790143345677.jpg',
    codeSnippet: {
      language: 'rust',
      filename: 'telemetry_decrypt.rs',
      code: `use aes_gcm::{Aes256Gcm, Key, Nonce};
use aes_gcm::aead::{Aead, KeyInit};

pub fn decrypt_frame(key_bytes: &[u8; 32], nonce_bytes: &[u8; 12], payload: &[u8]) -> Result<Vec<u8>, ()> {
    let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key_bytes));
    let nonce = Nonce::from_slice(nonce_bytes);
    cipher.decrypt(nonce, payload).map_err(|_| ())
}`
    },
    likes: 67,
    userLiked: false,
    bookmarks: 18,
    userBookmarked: true,
    comments: [
      {
        id: 'c3',
        author: {
          name: 'Brian Omondi',
          handle: '@omondi_red',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        },
        text: 'The 433MHz frequency band is notorious for unencrypted replay. Good to see Rust crypto implementation being standardized.',
        timestamp: '1h ago'
      }
    ],
    tags: ['SatelliteSec', 'MombasaCyber', 'UnderseaFiber', 'RadioHacking'],
    cryptoMeta: {
      algorithm: 'AES-256-GCM / PBKDF2-HMAC-SHA256',
      iv: '12ef4488bb990011cc44aa88',
      authTag: '77bc3300ff11223344556677889900aa',
      ciphertext: 'bf291a0c8411d0e...[ENCRYPTED_PAYLOAD_6.2KB]',
      sha256Hash: 'a71e892c90012df491024bcdae11029481920acb012398410293481029384710',
      keyId: 'SG-MOMBASA-PORT-02'
    }
  },
  {
    id: 'post_03',
    author: {
      id: 'usr_omondi_03',
      name: 'Brian Omondi',
      handle: '@omondi_red',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Red Team Specialist',
      verified: true,
      location: 'Milimani, Kisumu'
    },
    timestamp: '4h ago',
    content: 'Hardware security lab session: probing test pads on smart power grid RTU controllers. When hardware manufacturers leave debug SWD/JTAG ports enabled in commercial shipments, local bus dumping takes under 90 seconds. Always burn security eFuses prior to mass deployment!',
    image: '/src/assets/images/feed_hardware_hacking_1790143359047.jpg',
    likes: 112,
    userLiked: true,
    bookmarks: 45,
    userBookmarked: true,
    comments: [
      {
        id: 'c4',
        author: {
          name: 'Banner Mwangi',
          handle: '@banner_sec',
          avatar: '/src/assets/images/avatar_cyber_kenya_1790143371413.jpg'
        },
        text: 'Did they leave the flash read-out protection (RDP Level 0) enabled, or did you have to glitch the power rail?',
        timestamp: '3h ago'
      },
      {
        id: 'c5',
        author: {
          name: 'Brian Omondi',
          handle: '@omondi_red',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        },
        text: 'Straight RDP Level 0! No glitching even needed. OpenOCD connected instantly.',
        timestamp: '3h ago'
      }
    ],
    tags: ['HardwareHacking', 'JTAG', 'SmartGrid', 'KenyaPower', 'IoTDefense'],
    cryptoMeta: {
      algorithm: 'AES-256-GCM / PBKDF2-HMAC-SHA256',
      iv: '5566778899aabbccddeeff00',
      authTag: '11223344556677889900aabbccddeeff',
      ciphertext: '00ffaa11223344...[ENCRYPTED_PAYLOAD_11.8KB]',
      sha256Hash: '9841a0e102938471029384102938410293841029384102938410293841029384',
      keyId: 'SG-KISUMU-LAB-04'
    }
  }
];

export const INITIAL_DIRECT_MESSAGES: DirectMessage[] = [
  {
    id: 'msg_01',
    senderId: 'usr_wanjiku_02',
    receiverId: 'usr_banner_01',
    plaintext: 'Hey Banner, did you see the KeCERT advisory on the SACCO portal phishing? We are seeing the same domain pattern registered on Africa.com.',
    ciphertext: 'c90f234190ab78...[AES-256-GCM CIPHERTEXT]',
    iv: 'a0b1c2d3e4f5061728394a5b',
    authTag: '1234567890abcdef1234567890abcdef',
    timestamp: '10:14 AM',
    isDelivered: true
  },
  {
    id: 'msg_02',
    senderId: 'usr_banner_01',
    receiverId: 'usr_wanjiku_02',
    plaintext: 'Yes Wanjiku. I extracted the IOCs and ran a Whois pivot. The nameservers point to an offshore bulletproof host. I sent the automated blocklist script to the Kenya Bankers Association security list.',
    ciphertext: '11aa22bb33cc44...[AES-256-GCM CIPHERTEXT]',
    iv: 'b2c3d4e5f60718293a4b5c6d',
    authTag: 'abcdef1234567890abcdef1234567890',
    timestamp: '10:18 AM',
    isDelivered: true
  },
  {
    id: 'msg_03',
    senderId: 'usr_wanjiku_02',
    receiverId: 'usr_banner_01',
    plaintext: 'Excellent work. Let us test our ML-KEM encrypted channel for the upcoming Nairobi Defcon village keynote.',
    ciphertext: '8899aabbccddeeff...[AES-256-GCM CIPHERTEXT]',
    iv: 'c3d4e5f60718293a4b5c6d7e',
    authTag: 'fedcba0987654321fedcba0987654321',
    timestamp: '10:22 AM',
    isDelivered: true
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ctf_01',
    title: 'Safaricom Daraja API Signature Replay',
    category: 'FinTech KE',
    points: 150,
    difficulty: 'Easy',
    description: 'An insecure merchant webhook verifies the M-Pesa transaction callback HMAC, but lacks a nonce deduplication cache. Can you replay an authentic transaction payload with an altered timestamp parameter to trigger the simulated disbursement flag?',
    author: '@banner_sec',
    solvedCount: 42,
    hints: [
      'Inspect the request header `X-Daraja-Timestamp` vs `X-Daraja-Signature`.',
      'The server accepts tokens within a 300s window if transactionId is not recorded in the temporary bloom filter.'
    ],
    artifactSnippet: {
      name: 'replay_audit_spec.http',
      content: `POST /api/v1/mpesa/c2b/callback HTTP/1.1\nHost: sandbox.safaricom.co.ke\nX-Daraja-Signature: 89f41a00e238910...\nX-Daraja-Timestamp: 20260922110200\n{"TransactionType":"Pay Bill","TransID":"RJH89201LK","TransAmount":"1500.00"}`
    },
    flagAnswer: 'flag{daraja_timestamp_replay_bypass_254}',
    userSolved: true
  },
  {
    id: 'ctf_02',
    title: 'Nairobi Metro SCADA Modbus Inversion',
    category: 'Network Forensics',
    points: 250,
    difficulty: 'Medium',
    description: 'A packet capture recorded during maintenance of the Nairobi Commuter Rail signaling system contains anomalous Modbus TCP packets sent to slave ID 4. Find the register write value that bypassed safety interlocks.',
    author: '@omondi_red',
    solvedCount: 28,
    hints: [
      'Filter Wireshark by `modbus.func_code == 6 || modbus.func_code == 16`.',
      'Look for Coil Register 0x00FF containing an emergency shutoff override byte.'
    ],
    artifactSnippet: {
      name: 'modbus_stream.hex',
      content: `000100000006040600ff0001 -> Function 6 (Write Single Register) at address 255 with value 0x0001`
    },
    flagAnswer: 'flag{modbus_coil_register_override_ke}',
    userSolved: false
  },
  {
    id: 'ctf_03',
    title: 'SIM Toolkit (STK) Binary Decompilation',
    category: 'Reverse Engineering',
    points: 350,
    difficulty: 'Hard',
    description: 'Decompile the Java Card applet extracted from a legacy Kenyan telecom SIM profile. Find the hidden command handler that executes over-the-air binary SMS instructions without prompting for the user PIN.',
    author: '@wanjiku_crypto',
    solvedCount: 15,
    hints: [
      'The APDU command class `0x80` routes to a custom proprietary dispatcher.',
      'Check instruction byte `0x3C` (OTA_ADMIN_EXEC) which checks for hardcoded fallback DES keys.'
    ],
    artifactSnippet: {
      name: 'SimApplet.cap',
      content: `0x80 0x3C 0x01 0x00 0x08 [4B 45 59 5F 32 35 34 21] // DES Key vector "KEY_254!"`
    },
    flagAnswer: 'flag{stk_ota_crypto_vector_exposed}',
    userSolved: false
  },
  {
    id: 'ctf_04',
    title: 'KRA Portal JWT Null Signature Bypass',
    category: 'Web Exploitation',
    points: 200,
    difficulty: 'Medium',
    description: 'The simulated revenue authority declaration API accepts RS256 signed JWTs from authorized tax agents. Can you forge an administrative token by stripping the signature and specifying `alg: none`?',
    author: '@kiprono_cloud',
    solvedCount: 36,
    hints: [
      'Base64URL decode the JWT header and change `"alg": "RS256"` to `"alg": "none"` or `"alg": "None"`.',
      'Set `"role": "super_auditor_ke"` and remove the signature portion after the second period.'
    ],
    artifactSnippet: {
      name: 'sample_jwt.txt',
      content: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWdlbnRfMjU0Iiwicm9sZSI6InRheF9wYXllciIsImlhdCI6MTc5MDE0MzAwMH0.[SIGNATURE]`
    },
    flagAnswer: 'flag{jwt_alg_none_tax_evasion_fixed}',
    userSolved: true
  },
  {
    id: 'ctf_05',
    title: 'Mombasa Port Container Tracking Hash Collision',
    category: 'Cryptography',
    points: 400,
    difficulty: 'Elite',
    description: 'Generate two differing customs manifests with identical MD5/SHA-1 legacy container checksums accepted by legacy marine port terminal operating software.',
    author: '@amina_dfir',
    solvedCount: 9,
    hints: [
      'Utilize fastcoll or UniColl prefix collision blocks.',
      'The cargo weight field in bytes 64-96 is the target alignment boundary.'
    ],
    artifactSnippet: {
      name: 'manifest_header.bin',
      content: `PORT_MOMBASA_MANIFEST_V1.4 | VESSEL: KILINDINI_EXPRESS | BERTH: 16 | CARGO_BLOCK: 0x4A`
    },
    flagAnswer: 'flag{sha1_md5_port_transit_collision}',
    userSolved: false
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    id: 'usr_wanjiku_02',
    name: 'Dr. Wanjiku Ndung\'u',
    handle: '@wanjiku_crypto',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    location: 'Nairobi',
    score: 2850,
    challengesSolved: 19,
    badge: 'Cryptographic Sovereign'
  },
  {
    rank: 2,
    id: 'usr_omondi_03',
    name: 'Brian Omondi',
    handle: '@omondi_red',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'Kisumu',
    score: 2420,
    challengesSolved: 16,
    badge: 'Hardware Red Team Lead'
  },
  {
    rank: 3,
    id: 'usr_banner_01',
    name: 'Banner Mwangi',
    handle: '@banner_sec',
    avatar: '/src/assets/images/avatar_cyber_kenya_1790143371413.jpg',
    location: 'Nairobi',
    score: 2150,
    challengesSolved: 14,
    badge: 'Fintech Shield Master'
  },
  {
    rank: 4,
    id: 'usr_kiprono_05',
    name: 'Kevin Kiprono',
    handle: '@kiprono_cloud',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    location: 'Eldoret',
    score: 1980,
    challengesSolved: 13,
    badge: 'Kernel Guardian'
  },
  {
    rank: 5,
    id: 'usr_amina_04',
    name: 'Amina Omar',
    handle: '@amina_dfir',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    location: 'Mombasa',
    score: 1760,
    challengesSolved: 11,
    badge: 'DFIR Maritime Scout'
  }
];

export const INITIAL_RESOURCES: CodingResource[] = [
  {
    id: 'res_01',
    title: 'M-Pesa / Daraja API HMAC-SHA256 Fuzzer & Validator',
    category: 'Web3 & FinTech Security',
    language: 'Python',
    description: 'Production fuzzer and timing-safe validator for Safaricom Daraja API B2C/C2B callback payloads. Tests replay resilience, timestamp jitter, and malformed JSON parameter injections.',
    author: {
      name: 'Banner Mwangi',
      handle: '@banner_sec'
    },
    code: `#!/usr/bin/env python3
"""
SecureGate Kenya - Daraja B2C/C2B Callback Security Fuzzer
Author: Banner Mwangi (@banner_sec)
"""
import hmac
import hashlib
import time
import json
import secrets

def generate_test_vector(secret_key: str, amount: str, phone: str):
    timestamp = time.strftime('%Y%m%d%H%M%S')
    nonce = secrets.token_hex(8)
    payload = {
        "TransID": f"SG{int(time.time())}",
        "TransAmount": amount,
        "MSISDN": phone,
        "Timestamp": timestamp,
        "Nonce": nonce
    }
    raw_bytes = json.dumps(payload, sort_keys=True).encode()
    signature = hmac.new(secret_key.encode(), raw_bytes, hashlib.sha256).hexdigest()
    return payload, signature

if __name__ == '__main__':
    print("[*] Generating Daraja Sandbox Security Test Vector...")
    data, sig = generate_test_vector("KE_PROD_SECRET_254", "2500.00", "254722000254")
    print(f"[+] Payload: {json.dumps(data, indent=2)}")
    print(f"[+] Timing-Safe Signature: {sig}")
    print("[+] Test completed. All parameters verified against CBK cyber guidelines.")`,
    simulatedOutput: `[*] Generating Daraja Sandbox Security Test Vector...
[+] Payload: {
  "MSISDN": "254722000254",
  "Nonce": "7a8b9c0d1e2f3a4b",
  "Timestamp": "20260922110500",
  "TransAmount": "2500.00",
  "TransID": "SG1790143500"
}
[+] Timing-Safe Signature: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
[+] Test completed. All parameters verified against CBK cyber guidelines.`,
    downloads: 312,
    stars: 89,
    userStarred: true,
    tags: ['FinTech', 'Daraja', 'Python', 'APIHardening', 'Kenya'],
    updatedAt: 'Yesterday'
  },
  {
    id: 'res_02',
    title: 'Automated Ubuntu 24.04 Baseline for Kenyan SACCO Servers',
    category: 'Defensive & Hardening',
    language: 'Bash',
    description: 'Hardening script enforcing CIS Level 2 benchmarks, automatic unattended security patches, UFW firewall restriction to local Kenyan subnets, SSH public-key only with Ed25519, and Fail2Ban jail configuration.',
    author: {
      name: 'Kevin Kiprono',
      handle: '@kiprono_cloud'
    },
    code: `#!/usr/bin/env bash
# SecureGate Kenya - Financial Infrastructure Server Baseline
set -euo pipefail

echo "[+] Initiating Kenyan Financial Host Hardening..."

# 1. Disable legacy protocols
cat << 'EOF' > /etc/modprobe.d/disable-legacy.conf
install dccp /bin/true
install sctp /bin/true
install rds /bin/true
install tipc /bin/true
EOF

# 2. Strict SSH config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
echo "KexAlgorithms curve25519-sha256@libssh.org" >> /etc/ssh/sshd_config

# 3. Kernel sysctl parameters for anti-spoofing
sysctl -w net.ipv4.conf.all.rp_filter=1
sysctl -w net.ipv4.tcp_syncookies=1
sysctl -p

echo "[✓] Kenyan Host Hardening Applied Successfully."`,
    simulatedOutput: `[+] Initiating Kenyan Financial Host Hardening...
[+] Disabling uncommon network protocols (dccp, sctp, rds, tipc)...
[+] Hardening SSH daemon: Passwords disabled, Root login prohibited...
[+] Enforcing kernel anti-spoofing (rp_filter) & SYN cookie defense...
[✓] Kenyan Host Hardening Applied Successfully. Baseline audit passed.`,
    downloads: 245,
    stars: 76,
    userStarred: false,
    tags: ['Bash', 'CIS-Level-2', 'ServerHardening', 'SACCO', 'Linux'],
    updatedAt: '3 days ago'
  },
  {
    id: 'res_03',
    title: 'High-Throughput eBPF DDoS Flow Dropper for KIXP Nodes',
    category: 'Network & Scada',
    language: 'Go',
    description: 'Golang controller with eBPF C kernel program to filter volumetric SYN/UDP floods directly at the XDP network card layer before kernel socket buffer allocation.',
    author: {
      name: 'Banner Mwangi',
      handle: '@banner_sec'
    },
    code: `package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	fmt.Println("[*] SecureGate eBPF Flow Engine loading on interface eth0 (KIXP Node)...")
	fmt.Println("[*] XDP generic driver hook attached.")
	fmt.Println("[+] Rate limiter: 50,000 pps per /24 subnet.")
	
	stopper := make(chan os.Signal, 1)
	signal.Notify(stopper, os.Interrupt, syscall.SIGTERM)
	
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()
	
	fmt.Println("[✓] eBPF filter running. Zero kernel drops. Packet mitigation active.")
}`,
    simulatedOutput: `[*] SecureGate eBPF Flow Engine loading on interface eth0 (KIXP Node)...
[*] XDP generic driver hook attached.
[+] Rate limiter: 50,000 pps per /24 subnet.
[✓] eBPF filter running. Zero kernel drops. Packet mitigation active.`,
    downloads: 189,
    stars: 64,
    userStarred: true,
    tags: ['Go', 'eBPF', 'DDoS', 'KIXP', 'Networking'],
    updatedAt: '5 days ago'
  }
];

export const INITIAL_FORUMS: ForumThread[] = [
  {
    id: 'forum_01',
    channel: 'fintech-security-ke',
    title: 'Preventing concurrent double-spending in USSD mobile banking menus',
    author: {
      name: 'Banner Mwangi',
      handle: '@banner_sec',
      avatar: '/src/assets/images/avatar_cyber_kenya_1790143371413.jpg',
      role: 'Fintech Security Architect'
    },
    content: 'When users send concurrent USSD requests via dual SIM phones or script automated session handshakes (*123*1# followed by rapid cancel/re-entry), some core banking systems show a race condition where account balances are debited asynchronously after the cash-out token is minted. How are local teams enforcing atomic locks without slowing down the 20-second Telco USSD session timeout?',
    codeSnippet: `// Problematic pseudo-code in legacy gateway:
async function handleUssdWithdraw(accountId, amount) {
  const balance = await getBalance(accountId); // Non-atomic read
  if (balance >= amount) {
    const token = await mintWithdrawalToken(accountId, amount);
    await deductBalance(accountId, amount); // Race window here!
    return token;
  }
}`,
    tags: ['USSD', 'RaceCondition', 'FintechKE', 'Concurrency'],
    timestamp: '2h ago',
    upvotes: 38,
    userUpvoted: true,
    isSolved: true,
    replies: [
      {
        id: 'rep_01',
        author: {
          name: 'Kevin Kiprono',
          handle: '@kiprono_cloud',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          role: 'Core Security Researcher'
        },
        content: 'We solved this in production by executing a Redis Lua script containing the balance check and reservation in a single atomic cycle. The lock takes <2ms, well within the Safaricom 20-second session limit.',
        codeSnippet: `local current = redis.call('GET', KEYS[1])
if tonumber(current) >= tonumber(ARGV[1]) then
    redis.call('DECRBY', KEYS[1], ARGV[1])
    return 1
else
    return 0
end`,
        timestamp: '1h ago',
        upvotes: 27,
        userUpvoted: true,
        isVerifiedFix: true
      }
    ]
  },
  {
    id: 'forum_02',
    channel: 'incident-response',
    title: 'Detecting anomalous SEACOM & EASSy BGP announcements in East Africa',
    author: {
      name: 'Amina Omar',
      handle: '@amina_dfir',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'DFIR Analyst'
    },
    content: 'Yesterday between 14:00 and 14:30 EAT, we observed multiple Kenyan autonomous system numbers (ASNs) momentarily routing through an unverified transit provider in Eastern Europe. KeCERT has alerted local telcos. What RPKI ROV (Route Origin Validation) tools are members using to automatically drop invalid route advertisements?',
    tags: ['BGP', 'RPKI', 'KeCERT', 'Telecom'],
    timestamp: '5h ago',
    upvotes: 45,
    userUpvoted: false,
    isSolved: false,
    replies: [
      {
        id: 'rep_02',
        author: {
          name: 'Brian Omondi',
          handle: '@omondi_red',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          role: 'Red Team Specialist'
        },
        content: 'Routinator paired with BIRD 2.x handles ROV validation seamlessly. Routinator syncs every 10 minutes with AFRINIC repository and feeds ROA validation tables directly into BIRD via RTR protocol.',
        timestamp: '3h ago',
        upvotes: 19,
        userUpvoted: false
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    timestamp: 'Just now',
    event: 'Specialist Authenticated (Phone OTP + Face Scan)',
    ipAddress: '197.232.89.44 (Safaricom Fixed Fiber)',
    location: 'Westlands, Nairobi, KE',
    device: 'Linux x86_64 / Firefox hardened',
    status: 'Verified',
    userHandle: '@banner_sec',
    authMethod: 'Phone OTP + Face Scan',
    biometricScore: '99.8% Neural Match',
    isLoginEvent: true,
    details: 'MFA clearance successful. Safaricom SMS OTP confirmed, 128-point facial mesh liveness verified.'
  },
  {
    id: 'log_02',
    timestamp: '25m ago',
    event: 'Specialist Login: Dr. Wanjiku Ndung\'u',
    ipAddress: '105.160.12.18 (Airtel 5G Kilimani)',
    location: 'Kilimani, Nairobi, KE',
    device: 'MacOS Sequoia / Safari PGP Enclave',
    status: 'Verified',
    userHandle: '@wanjiku_crypto',
    authMethod: 'Phone OTP + Face Scan',
    biometricScore: '99.4% Neural Match',
    isLoginEvent: true,
    details: 'Authenticated via +254 711 *** 889 and front-facing iris/biometric liveness pass.'
  },
  {
    id: 'log_03',
    timestamp: '1h ago',
    event: 'Specialist Login: Brian Omondi',
    ipAddress: '41.89.224.11 (Liquid Intelligent Tech)',
    location: 'Kisumu, KE',
    device: 'ThinkPad T480 / Qubes OS',
    status: 'Verified',
    userHandle: '@omondi_red',
    authMethod: 'Phone OTP + Face Scan',
    biometricScore: '99.6% Neural Match',
    isLoginEvent: true,
    details: 'Login from Western Kenya node. Dual-factor OTP and biometric scan verified.'
  },
  {
    id: 'log_04',
    timestamp: '3h ago',
    event: 'Encrypted Cloud Backup Snapshot Created',
    ipAddress: '197.232.89.44',
    location: 'Nairobi, KE',
    device: 'SecureGate Automated Vault Agent',
    status: 'Verified',
    details: 'Snapshot #SG-BCK-9021 compiled with AES-256-GCM. SHA-256 integrity checked.'
  },
  {
    id: 'log_05',
    timestamp: '5h ago',
    event: 'Specialist Login: Amina Omar',
    ipAddress: '197.237.140.5 (Mombasa IXP Gateway)',
    location: 'Mombasa, KE',
    device: 'Arch Linux / Chromium Secure',
    status: 'Verified',
    userHandle: '@amina_dfir',
    authMethod: 'Phone OTP + Face Scan',
    biometricScore: '99.9% Neural Match',
    isLoginEvent: true,
    details: 'Coastal port operations desk login. Biometric facial contours matched.'
  },
  {
    id: 'log_06',
    timestamp: '8h ago',
    event: 'Unauthorized Referral Code Attempt Blocked',
    ipAddress: '41.90.112.9 (Kisumu Dial-in)',
    location: 'Kisumu, KE',
    device: 'Automated Bot Scanner',
    status: 'Alert',
    isLoginEvent: true,
    details: 'Registration attempt rejected: missing cryptographically signed referral code.'
  }
];

export const INITIAL_BACKUPS: BackupSnapshot[] = [
  {
    id: 'bck_01',
    timestamp: 'Today at 22:45 EAT',
    sizeKb: 148,
    sha256Hash: '4a9bc8110928374aef1209384710293847102938471029384710293847102938',
    itemsCount: {
      posts: 3,
      messages: 3,
      challengesSolved: 2,
      savedResources: 2
    },
    status: 'Encrypted & Stored',
    backedByHandle: '@banner_sec',
    encryptionAlgorithm: 'AES-256-GCM (256-bit key)'
  },
  {
    id: 'bck_02',
    timestamp: 'Yesterday at 23:59 EAT',
    sizeKb: 132,
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    itemsCount: {
      posts: 2,
      messages: 2,
      challengesSolved: 1,
      savedResources: 1
    },
    status: 'Verified',
    backedByHandle: '@banner_sec',
    encryptionAlgorithm: 'AES-256-GCM (256-bit key)'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job_01',
    title: 'Lead Red Team Operator (FinTech & M-Pesa Security)',
    company: 'Safaricom PLC Cyber Defense',
    location: 'Nairobi, KE (Westlands HQ)',
    type: 'Full-time',
    salaryKes: 'KES 550,000 - 850,000 / month',
    category: 'FinTech Security',
    urgent: true,
    description: 'Lead offensive simulation exercises against payment gateways, SIM-swap mitigation pipelines, and core microservices infrastructure across Kenya and East Africa.',
    requirements: [
      'Proven CTF / OSCP / CRTO certification or equivalent real-world portfolio',
      'Extensive experience with Daraja API, ISO8583 financial messaging, and Android reverse engineering',
      'KeCERT or SecureGate verified peer status'
    ],
    responsibilities: [
      'Conduct zero-warning red team engagements against critical fintech nodes',
      'Collaborate with blue team architects on real-time detection rule engineering',
      'Publish vulnerability remediation memos to executive risk committees'
    ],
    postedBy: {
      name: 'Dr. Wanjiku Ndung\'u',
      handle: '@wanjiku_crypto',
      verified: true
    },
    postedAt: 'Today at 09:30 EAT',
    applicantsCount: 6
  },
  {
    id: 'job_02',
    title: 'Critical Infrastructure SCADA Penetration Specialist',
    company: 'KenGen Cyber Resilience Unit',
    location: 'Naivasha / Nairobi, KE (Hybrid)',
    type: 'Contract',
    salaryKes: 'KES 1,200,000 / 3-month Contract',
    category: 'SCADA & Infrastructure',
    urgent: false,
    description: 'Perform air-gap assessment and industrial network telemetry penetration testing on geothermal power generation telemetry systems.',
    requirements: [
      'GICSP or deep protocol knowledge (Modbus, DNP3, IEC 60870-5-104)',
      'Hardware packet sniffing and firmware decompilation skills',
      'Kenyan security clearance'
    ],
    responsibilities: [
      'Identify air-gap perimeter anomalies across sub-stations',
      'Inspect PLC firmware integrity and ladder logic tampering vulnerabilities'
    ],
    postedBy: {
      name: 'Brian Omondi',
      handle: '@omondi_red',
      verified: true
    },
    postedAt: 'Yesterday',
    applicantsCount: 4
  },
  {
    id: 'job_03',
    title: 'Smart Contract & Cryptographic Auditor (Bounty)',
    company: 'Chipper Cash & FinTech Labs',
    location: 'Remote Kenya',
    type: 'Red Team Bounty',
    salaryKes: 'KES 2,000,000 Bounty Pool',
    category: 'FinTech Security',
    urgent: true,
    description: 'High-stakes security audit of multi-currency cross-border liquidity pools and zero-knowledge escrow verification smart contracts.',
    requirements: [
      'Deep EVM & Solana architecture expertise',
      'Prior security disclosures on Immunefi or Code4rena',
      'Strong zero-knowledge proof comprehension'
    ],
    responsibilities: [
      'Discover and exploit re-entrancy, oracle manipulation, and signature replay vectors',
      'Provide proof-of-concept exploits with Foundry or Hardhat'
    ],
    postedBy: {
      name: 'Banner Mwangi',
      handle: '@banner_sec',
      verified: true
    },
    postedAt: '2 days ago',
    applicantsCount: 11
  },
  {
    id: 'job_04',
    title: 'Emergency DFIR Responder & Port Security Lead',
    company: 'Kenya Ports Authority & KeCERT Hub',
    location: 'Kilindini Port, Mombasa, KE',
    type: 'Incident Retainer',
    salaryKes: 'KES 400,000 Retainer + KES 15,000/hr Deployment',
    category: 'DFIR & SOC',
    urgent: true,
    description: '24/7 on-call tier-3 incident responder for maritime logistics systems, container tracking mainframes, and customs database telemetry.',
    requirements: [
      'Deep Linux & Windows memory forensics (Volatility 3, Rekall)',
      'Network capture carving (Wireshark, Zeek, Suricata)',
      'Incident management experience under CA / KeCERT standards'
    ],
    responsibilities: [
      'Lead triage in the event of ransomware or advanced persistent threat (APT) attacks',
      'Perform forensic disk preservation and legal chain of custody documentation'
    ],
    postedBy: {
      name: 'Amina Omar',
      handle: '@amina_dfir',
      verified: true
    },
    postedAt: '3 days ago',
    applicantsCount: 8
  },
  {
    id: 'job_05',
    title: 'Cloud Security Architect (Kubernetes & eBPF)',
    company: 'Equity Group Digital Engine',
    location: 'Nairobi, KE (Upper Hill)',
    type: 'Full-time',
    salaryKes: 'KES 480,000 - 680,000 / month',
    category: 'Cloud & DevSecOps',
    urgent: false,
    description: 'Architect zero-trust Kubernetes clusters across multi-cloud availability zones using Cilium, eBPF telemetry, and SPIFFE/SPIRE workload identities.',
    requirements: [
      'CKS (Certified Kubernetes Security Specialist)',
      'Deep Linux kernel security & eBPF tracing skills',
      'Experience with banking-grade compliance (PCI-DSS 4.0)'
    ],
    responsibilities: [
      'Deploy continuous cloud security posture management',
      'Automate policy enforcement via Gatekeeper / Kyverno and Falco'
    ],
    postedBy: {
      name: 'Kevin Kiprono',
      handle: '@kiprono_cloud',
      verified: true
    },
    postedAt: '4 days ago',
    applicantsCount: 5
  }
];

export const INITIAL_HIRE_PROPOSALS: HireProposal[] = [
  {
    id: 'prop_01',
    specialistId: 'usr_banner_01',
    specialistName: 'Banner Mwangi',
    specialistHandle: '@banner_sec',
    clientName: 'Nairobi FinTech Labs',
    clientHandle: '@nai_labs',
    projectTitle: 'Daraja Mobile Payment Gateway Penetration Audit',
    engagementType: 'Vulnerability Audit',
    budgetKes: 'KES 450,000',
    timeline: '2 Weeks (Sprint)',
    scopeDescription: 'Review reverse proxy endpoint, OAuth token lifecycle, and callback replay mitigation on staging cluster.',
    status: 'In Progress',
    createdAt: '2026-09-20'
  }
];


export const VALID_REFERRAL_CODES: string[] = [
  'SEC-KE-254',
  'NAIROBI-ROOT',
  'CYBER-SAVANNAH',
  'SILICON-GATE-01',
  'KECERT-ALPHA',
  'SEC-KE-BANNER',
  'SEC-KE-WANJIKU',
  'SEC-KE-OMONDI',
  'SEC-KE-AMINA',
  'SEC-KE-KIPRONO'
];
