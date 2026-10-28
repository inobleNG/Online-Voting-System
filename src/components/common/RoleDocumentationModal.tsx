import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Building2,
  MapPin,
  Users,
  Vote,
  FileCheck2,
  QrCode,
  Lock,
  ChevronRight,
  ExternalLink,
  Layers,
  Award,
  AlertTriangle,
  Download,
  Search,
  ArrowRight,
  HelpCircle,
  Clock,
  Printer
} from 'lucide-react';
import { Modal } from './Modal';
import { UserRole } from '../../types';

interface RoleDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  onSelectAction?: (tab: string) => void;
}

interface StepItem {
  step: number;
  title: string;
  shortDesc: string;
  details: string[];
  actionLabel?: string;
  actionTab?: string;
  tip?: string;
}

interface RoleDoc {
  roleId: UserRole | 'spo';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  overview: string;
  responsibilities: string[];
  steps: StepItem[];
  securityNotes: string[];
}

export const ROLE_DOCS: Record<string, RoleDoc> = {
  voter: {
    roleId: 'voter',
    title: 'Accredited Elector (Citizen) Operational Guide',
    subtitle: 'Official Step-by-Step Manual: From Accreditation to Merkle Ledger Verification',
    badge: 'CITIZEN ELECTOR PORTAL',
    badgeColor: 'bg-emerald-50 text-[#008751] border-emerald-200',
    overview:
      'As a constitutionally qualified Nigerian citizen, this portal enables you to verify your accreditation status, study contesting candidates and their policy manifestos, cast a secret cryptographically encrypted ballot, and verify that your vote has been recorded into the national ledger without revealing your candidate choice.',
    responsibilities: [
      'Safeguard your confidential 6-digit E-Voting PIN; never share it with polling agents.',
      'Review candidate profiles, track records, and manifesto pillars before entering the booth.',
      'Cast your secret ballot freely and without coercion during gazetted voting hours.',
      'Download and retain your official Cryptographic Balloting Receipt containing the 64-character SHA-256 hash.',
      'Optionally audit receipt inclusion in the public Merkle ledger using the Receipt Validator.',
    ],
    steps: [
      {
        step: 1,
        title: 'Accreditation & Digital PVC Verification',
        shortDesc: 'Sign in with your 19-digit Voter ID (VIN), National NIN, or Permanent Voter Card (PVC) and confidential 6-digit PIN.',
        details: [
          'Navigate to the Accredited Elector Portal and enter your VIN / PVC number.',
          'Provide your confidential 6-digit authentication PIN (or use sample demo credentials for test simulation).',
          'Confirm that your registered State, Local Government Area (LGA), Ward, and Polling Unit (PU) match your physical card.',
          'Verify that your biometric status shows "ACCREDITED / READY".',
        ],
        actionLabel: 'Go to Elector Dashboard',
        actionTab: 'voter-home',
        tip: 'If your card shows suspended or pending, contact your Resident Electoral Commissioner (REC).',
      },
      {
        step: 2,
        title: 'Review Active Gazetted Elections',
        shortDesc: 'Inspect the list of ongoing, upcoming, and certified elections scheduled by the Commission.',
        details: [
          'From your dashboard, review the gazetted elections (e.g. 2026 Presidential & National Assembly Election).',
          'Check the election timetable to confirm the poll status is currently "ACTIVE".',
          'Notice whether you have already cast a ballot for that session (marked as "Vote Recorded") or if the ballot is "Ready to Vote".',
        ],
        actionLabel: 'View Active Ballots',
        actionTab: 'voter-home',
      },
      {
        step: 3,
        title: 'Candidate Profile & Manifesto Scrutiny',
        shortDesc: 'Examine candidate track records, educational credentials, and comprehensive policy manifestos.',
        details: [
          'Click on any candidate card or "View Nominee Ledger" to inspect contesting aspirants.',
          'Read their vision statement, educational qualifications, and key policy pillars (Economy, Security, Education, Infrastructure).',
          'Compare candidates for each contested position (e.g. President, Senatorial District, Federal Constituency).',
        ],
        actionLabel: 'Explore Nominees',
        actionTab: 'candidates',
        tip: 'Every candidate submitted an official signed policy manifesto accessible in the portal.',
      },
      {
        step: 4,
        title: 'Access the Digital Voting Booth',
        shortDesc: 'Enter the isolated, secure voting booth and cast your confidential encrypted ballot.',
        details: [
          'Step 4A: Enter your 6-digit E-Voting PIN again at the booth threshold to unlock the cryptographic ballot.',
          'Step 4B: Select your preferred candidate for each contested office (e.g., President, Senate, House of Reps).',
          'Step 4C: The system enforces maximum candidate selections per office and prevents over-voting.',
          'Step 4D: Review your summary screen carefully before the irreversible final submission.',
          'Step 4E: Click "Cast Secret Ballot" — your choice is locally hashed and encrypted with zero-knowledge cryptographic privacy.',
        ],
        actionLabel: 'Open Voting Booth',
        actionTab: 'voting-booth',
        tip: 'Once submitted, ballots cannot be altered or deleted. Double voting is cryptographically impossible.',
      },
      {
        step: 5,
        title: 'Download & Safeguard Your Cryptographic Receipt',
        shortDesc: 'Receive your official INEC digital receipt equipped with QR code and SHA-256 ballot hash.',
        details: [
          'Immediately upon casting, the system generates an official Federal Republic of Nigeria Vote Receipt.',
          'The receipt includes your unique Receipt ID, Timestamp, Polling Unit Code, and 64-character SHA-256 Ballot Hash.',
          'Crucially, the receipt DOES NOT disclose which candidate you voted for, upholding absolute ballot secrecy.',
          'Click "Download Receipt" or "Print PDF" to keep an offline record of your civic duty.',
        ],
        actionLabel: 'Check Receipt Validator',
        actionTab: 'verify-receipt',
      },
      {
        step: 6,
        title: 'Public Merkle Ledger Verification',
        shortDesc: 'Verify that your individual vote has been committed into the national Merkle ledger.',
        details: [
          'Open the "Verify Vote Receipt" tool from the sidebar or your dashboard.',
          'Enter your 64-character ballot hash or upload/scan your receipt QR code.',
          'The validator recalculates the cryptographic path against the certified Merkle Tree Root.',
          'A green "VERIFIED ON IMMUTABLE LEDGER" badge confirms your vote was counted without revealing who you voted for.',
        ],
        actionLabel: 'Verify a Vote Receipt',
        actionTab: 'verify-receipt',
        tip: 'This guarantees end-to-end verifiability (E2E-V) compliant with international election standards.',
      },
    ],
    securityNotes: [
      'Your vote choice is never stored in plaintext alongside your name or VIN.',
      'Ballot hashing uses industry-standard SHA-256 zero-knowledge encryption.',
      'Anyone attempting to coerce you cannot verify your candidate choice from your receipt.',
    ],
  },

  admin: {
    roleId: 'admin',
    title: 'Chief Electoral Commissioner (CEC HQ) Manual',
    subtitle: 'National Command Center: Gazetting, National Collation & Merkle Certification',
    badge: 'INEC NATIONAL HEADQUARTERS (HQ)',
    badgeColor: 'bg-emerald-50 text-[#008751] border-emerald-200',
    overview:
      'As the Chief Electoral Commissioner and National Chairman of the Independent National Electoral Commission (INEC), you hold supreme executive authority over gazetting election sessions, candidate accreditations, voter register harmonization, nationwide telemetry, and final cryptographic Merkle root certification.',
    responsibilities: [
      'Create and gazette federal, state, and special election sessions with strict start/end timestamps.',
      'Define offices to be contested and set candidate threshold constraints (single vs multi-seat).',
      'Accredit political party nominees, approve candidate manifestos, and publish the candidate ledger.',
      'Harmonize and freeze the National Voter Roll registry across all 36 States and the Federal Capital Territory.',
      'Supervise real-time nationwide collation and monitor BVAS transmission integrity from all 774 LGAs.',
      'Publish the immutable Merkle Root hash and formally issue the Certificate of Return.',
    ],
    steps: [
      {
        step: 1,
        title: 'System Initialization & Cryptographic Key Ceremony',
        shortDesc: 'Verify database connectivity, security rules, and cryptographic hashing seeds.',
        details: [
          'Log in to the INEC Command Center using institutional credentials and two-factor authentication (2FA).',
          'Inspect the "Database Schema" tab to ensure PostgreSQL relational integrity and tables are active.',
          'Verify that audit logging is active and cryptographic block chaining is intact.',
        ],
        actionLabel: 'Open Command Center',
        actionTab: 'dashboard',
      },
      {
        step: 2,
        title: 'Gazetting & Scheduling an Election Session',
        shortDesc: 'Create a new national or sub-national election with legally binding parameters.',
        details: [
          'Navigate to "Gazetted Elections" in the sidebar.',
          'Click "+ Gazette New Election" and specify the official Election Title, Code, Category, and Description.',
          'Configure Start Time and End Time in accordance with the Electoral Act 2026.',
          'Enable "Require PIN Verification" for multi-factor authentication and "Allow Realtime Tally" for transparency.',
          'Set status to "Upcoming" or "Active" to activate polling stations nationwide.',
        ],
        actionLabel: 'Manage Elections',
        actionTab: 'elections',
        tip: 'Once an election starts, timestamps and core rules cannot be modified without an auditable gazette update.',
      },
      {
        step: 3,
        title: 'Configuring Contested Offices & Seats',
        shortDesc: 'Define legislative, executive, and regional offices contested in the session.',
        details: [
          'Go to "Offices & Wards" in the administrative navigation.',
          'Create contested offices such as President of the Federal Republic, Senatorial District, or House of Reps.',
          'Specify "Maximum Choices" (e.g., 1 for President, 3 for multi-seat councils) and "Minimum Choices".',
          'Mark offices as mandatory or optional to enforce ballot integrity at the voting booth.',
        ],
        actionLabel: 'Configure Offices',
        actionTab: 'positions',
      },
      {
        step: 4,
        title: 'Nominee Ledger & Candidate Manifesto Approval',
        shortDesc: 'Vetting political party candidates, photographs, and policy declarations.',
        details: [
          'Navigate to "Nominee Ledger & Manifestos".',
          'Review candidate nominations submitted by accredited political parties (APC, PDP, LP, NNPP, APGA, etc.).',
          'Upload official candidate passport portraits and verify their biometric clarity.',
          'Examine and attach the candidate’s official manifesto document, policy pillars, and vision statements.',
          'Click "Approve & Publish" to expose the nominee to citizen electors nationwide.',
        ],
        actionLabel: 'Manage Nominees',
        actionTab: 'candidates',
      },
      {
        step: 5,
        title: 'National Voter Roll Registry Harmonization',
        shortDesc: 'Import, deduplicate, and freeze the registered voter roll across all 36 States + FCT.',
        details: [
          'Navigate to "Voter Accreditation & PVCs".',
          'Review total registered voters (over 93 million electors in the national register).',
          'Use "Bulk CSV Upload" or "Add Accredited Elector" to onboard verified citizens.',
          'Inspect digital PVC cards and confirm that 19-digit VIN and 6-digit PIN are securely generated.',
          'Execute Register Freeze before polling opens to prevent voter register alteration during voting.',
        ],
        actionLabel: 'Open Voter Roll',
        actionTab: 'voters',
        tip: 'The voter roll hash is included in the national cryptographic commitment to prevent ghost voters.',
      },
      {
        step: 6,
        title: 'Nationwide Collation & Real-Time Telemetry Supervision',
        shortDesc: 'Supervise polling progress, turnout percentages, and BVAS uploads across the federation.',
        details: [
          'Open "Live Tally & Proofs" to monitor real-time vote aggregation as polling units transmit results.',
          'Inspect state-by-state heatmaps, leading candidates, and votes cast per candidate.',
          'Monitor the BVAS accreditation rate vs ballot cast ratio to detect over-voting in real-time.',
          'Coordinate with the 37 Resident Electoral Commissioners (RECs) stationed at state headquarters.',
        ],
        actionLabel: 'View Live Tally',
        actionTab: 'results',
      },
      {
        step: 7,
        title: 'Sealing Merkle Root Hash & Official Certification',
        shortDesc: 'Compute the irreversible cryptographic Merkle tree root and certify the election outcome.',
        details: [
          'Once voting concludes and all state collation returns (Form EC8D) are received, trigger Merkle Tree Generation.',
          'The system computes the cryptographic SHA-256 Merkle Root of all individual secret ballots.',
          'Click "Certify & Declare Election" to seal the Merkle root hash into the immutable public registry.',
          'Generate and sign the official National Declaration Certificate (Form EC8E).',
        ],
        actionLabel: 'Certify Results',
        actionTab: 'results',
        tip: 'Certification is mathematically irreversible. Any post-declaration ballot modification invalidates the hash.',
      },
    ],
    securityNotes: [
      'All administrative actions are permanently inscribed in the tamper-evident SHA-256 Audit Log.',
      'Emergency freeze controls in System Settings allow instant pause in case of severe national force majeure.',
      'Two-factor authentication (TOTP) is strictly enforced for all HQ administrative accounts.',
    ],
  },

  rec: {
    roleId: 'rec',
    title: 'Resident Electoral Commissioner (REC) State Operations Manual',
    subtitle: 'State Command Center: LGA Supervision, Polling Unit Collation & Form EC8D Signoff',
    badge: 'STATE ELECTORAL COMMAND (REC)',
    badgeColor: 'bg-emerald-50 text-[#008751] border-emerald-200',
    overview:
      'As the Resident Electoral Commissioner (REC), you represent the Commission at the State Headquarters. You oversee all Local Government Areas (LGAs), Wards, and Polling Units (PUs) within your state jurisdiction, ensuring voter accreditation quotas, supervising BVAS uploads, and verifying State Collation Sheets (Form EC8D).',
    responsibilities: [
      'Direct State Command Operations and supervise Electoral Officers (EOs) across all State LGAs.',
      'Monitor state voter roll accreditation rates and Permanent Voter Card (PVC) distribution.',
      'Audit incoming Polling Unit BVAS transmissions and resolve field discrepancy incidents.',
      'Oversee the State Collation Centre and compile LGA returning officer submissions (Form EC8C).',
      'Sign off on the State Summary of Results (Form EC8D) and transmit directly to the National CEC Chairman.',
    ],
    steps: [
      {
        step: 1,
        title: 'State Headquarters Readiness & LGA Activation',
        shortDesc: 'Initialize the State Command Center and confirm field communication with all LGA offices.',
        details: [
          'Sign in with your state-specific institutional credentials (e.g. rec.lagos@elections.gov.ng).',
          'Review your State Operational Dashboard displaying registered voters, active LGAs, and wards in your state.',
          'Confirm that all LGA Electoral Officers (EOs) and Supervisory Presiding Officers (SPOs) have synced their BVAS devices.',
        ],
        actionLabel: 'State Command Center',
        actionTab: 'dashboard',
      },
      {
        step: 2,
        title: 'State Voter Roll & PVC Accreditation Monitoring',
        shortDesc: 'Inspect voter register particulars for all wards and polling units within the state.',
        details: [
          'Navigate to "Voter Accreditation & PVCs".',
          'Filter by your State (e.g. Lagos, Kano, Rivers) to review registered citizens across your LGAs.',
          'Verify that all eligible electors possess active 19-digit VINs and biometric clearance.',
          'Audit PVC issuance metrics and address any reported voter identity disputes.',
        ],
        actionLabel: 'Inspect State Voter Roll',
        actionTab: 'voters',
      },
      {
        step: 3,
        title: 'Supervising Polling Unit BVAS Transmissions',
        shortDesc: 'Track real-time digital uploads of Polling Unit Result Sheets (Form EC8A).',
        details: [
          'Inspect the incoming transmission feeds from polling units across your state.',
          'Verify that the total votes cast does not exceed accredited voters in any polling unit (zero over-voting protocol).',
          'Investigate any flagged polling unit incidents or network retry warnings reported by field officers.',
        ],
        actionLabel: 'View Collation Feeds',
        actionTab: 'results',
        tip: 'BVAS transmissions are signed with hardware-level cryptographic key pairs.',
      },
      {
        step: 4,
        title: 'State Collation (Form EC8D Verification)',
        shortDesc: 'Reconcile LGA Returning Officers’ summaries into the comprehensive State Result Return.',
        details: [
          'Convene the State Collation Session with accredited political party agents and civic observers.',
          'Receive and cross-check LGA Collation Forms (EC8C) against digital BVAS cryptographic tallies.',
          'Compute the total votes scored by each contesting political party across the entire State.',
          'Record rejected ballots, valid votes, and accredited voter statistics on Form EC8D.',
        ],
        actionLabel: 'State Tally Proofs',
        actionTab: 'results',
      },
      {
        step: 5,
        title: 'Sign & Transmit State Results to CEC HQ',
        shortDesc: 'Cryptographically sign Form EC8D and transmit to the National Collation Centre in Abuja.',
        details: [
          'Apply your official Resident Electoral Commissioner cryptographic signature to the State Return.',
          'Transmit the certified State data packet to the Chief Electoral Commissioner (CEC HQ) in Abuja.',
          'Provide physical and digital copies to accredited political party agents and accredited election observers.',
        ],
        actionLabel: 'Review Audit Trails',
        actionTab: 'audit',
      },
    ],
    securityNotes: [
      'RECs cannot alter candidate lists or gazetted election rules; jurisdiction is strictly operational and state-level.',
      'Any discrepancy between field uploads and physical returns is flagged in the tamper-evident audit log.',
      'State-level results must be signed by the REC and State Collation Officer before national submission.',
    ],
  },

  spo: {
    roleId: 'spo',
    title: 'Supervisory Presiding Officer (SPO / EO) Field Manual',
    subtitle: 'Polling Unit Operations: Voter Accreditation, BVAS Verification & Form EC8A Transmission',
    badge: 'FIELD OPERATIONS (SPO / EO)',
    badgeColor: 'bg-emerald-50 text-[#008751] border-emerald-200',
    overview:
      'As a Supervisory Presiding Officer (SPO) or Electoral Officer (EO), you are the primary frontline custodian of the election at the Polling Unit and Ward level. You oversee the Bimodal Voter Accreditation System (BVAS), verify voter PVCs and PINs, ensure ballot secrecy, and execute results transmission (Form EC8A).',
    responsibilities: [
      'Deploy to assigned Polling Units and set up the private voting perimeter before 08:00 AM.',
      'Conduct voter accreditation by scanning PVC QR codes and verifying 6-digit confidential PINs.',
      'Ensure orderly citizen voting and strictly prevent voter intimidation, vote-buying, or double voting.',
      'Reconcile total accredited voters against total ballots cast at the close of poll (02:30 PM).',
      'Generate Polling Unit Form EC8A and transmit the cryptographic ballot payload to the Collation Center.',
    ],
    steps: [
      {
        step: 1,
        title: 'Polling Station Setup & Equipment Verification',
        shortDesc: 'Set up the secret voting booth, ballot screens, and BVAS terminals at the designated Polling Unit.',
        details: [
          'Arrive at the designated Polling Unit (e.g. PU: 24/08/02/005) before 07:30 AM.',
          'Check the BVAS battery status, network signal, and cryptographic clock synchronization.',
          'Display the register of voters for public inspection by waiting citizen electors and party agents.',
          'Ensure the voting booth is positioned to provide absolute voter privacy.',
        ],
        actionLabel: 'Field Command',
        actionTab: 'dashboard',
      },
      {
        step: 2,
        title: 'Accreditation of Citizen Electors',
        shortDesc: 'Verify citizen identity using Permanent Voter Cards (PVC) and confidential PINs.',
        details: [
          'Request the elector’s Permanent Voter Card (PVC) or 19-digit Voter ID (VIN).',
          'Scan the PVC QR code using the BVAS terminal or manually input the VIN.',
          'Direct the citizen to enter their 6-digit confidential E-Voting PIN on the terminal.',
          'Confirm biometric accreditation clearance — the system marks the elector as "Accredited".',
        ],
        actionLabel: 'Voter Register Check',
        actionTab: 'voters',
        tip: 'No citizen can vote without prior BVAS accreditation. If an elector is not on the roll, refer them to the EO.',
      },
      {
        step: 3,
        title: 'Supervision of Balloting & Secrecy Enforcement',
        shortDesc: 'Direct accredited voters to the voting screen and protect ballot confidentiality.',
        details: [
          'Once accredited, the voter proceeds to the isolated digital booth or balloting terminal.',
          'Ensure that no party agents or unauthorized persons linger near the voting screen.',
          'Strictly enforce the prohibition against cameras, smartphones, or recording devices inside the voting booth.',
          'Maintain order in the queue, giving priority to senior citizens, pregnant women, and persons with disabilities.',
        ],
        tip: 'Any attempt at ballot snatching or voter bribery must be immediately reported to security personnel.',
      },
      {
        step: 4,
        title: 'Close of Poll & Ballot Reconciliation',
        shortDesc: 'At 02:30 PM, declare the close of poll and count ballots in the presence of all witnesses.',
        details: [
          'Announce the close of accreditation and poll at the gazetted closing hour.',
          'Verify that the total votes cast exactly equals the total accredited voters on the BVAS log.',
          'Confirm that zero over-voting has occurred; if votes cast exceed accreditation, the poll is nullified according to law.',
        ],
        actionLabel: 'Check Live Tally',
        actionTab: 'results',
      },
      {
        step: 5,
        title: 'Transmitting Form EC8A to Collation Center',
        shortDesc: 'Transmit the cryptographically sealed Polling Unit result sheet (Form EC8A).',
        details: [
          'Record votes scored by each candidate on Polling Unit Form EC8A.',
          'Have all present political party agents and polling observers inspect and sign the physical and digital sheet.',
          'Trigger BVAS cryptographic transmission to upload Form EC8A directly to the INEC Results Viewing Portal (IReV).',
          'Escort result sheets and equipment safely to the Ward Collation Centre.',
        ],
        actionLabel: 'Verify Receipts',
        actionTab: 'verify-receipt',
      },
    ],
    securityNotes: [
      'SPOs cannot create or modify candidate lists or delete voter roll entries.',
      'The BVAS terminal stores an offline cryptographic ledger if cellular networks are temporarily unavailable.',
      'All accreditation attempts (successful and failed) are recorded in the forensic device log.',
    ],
  },

  auditor: {
    roleId: 'auditor',
    title: 'Independent Auditor & Observer Verification Manual',
    subtitle: 'Cryptographic Scrutiny: Merkle Proofs, Blockchain Continuity & Forensic Audit Trails',
    badge: 'CIVIL SOCIETY & ACCREDITED OBSERVER',
    badgeColor: 'bg-emerald-50 text-[#008751] border-emerald-200',
    overview:
      'As an Independent Auditor, Civil Society Observer (e.g. Transition Monitoring Group - TMG), or International Observer, you possess unrestricted read and verification access. You can audit cryptographic Merkle tree proofs, inspect tamper-evident audit logs, review voter roll distributions, and confirm election integrity.',
    responsibilities: [
      'Independently verify cryptographic Merkle tree roots published by the Commission.',
      'Audit tamper-evident SHA-256 hash chains for any unauthorized administrative changes.',
      'Examine voter registration curves and identify statistical turnout anomalies.',
      'Test citizen vote receipts against the public ledger to guarantee zero-knowledge receipt inclusion.',
      'Publish independent forensic election observation reports to the general public.',
    ],
    steps: [
      {
        step: 1,
        title: 'Public Ledger & Merkle Root Ingestion',
        shortDesc: 'Download and inspect the published cryptographic Merkle tree root hash.',
        details: [
          'Sign in with auditor credentials (e.g. auditor@civic-watch.ng).',
          'Navigate to "Tally Proofs & Roots" to examine the current election’s Merkle root.',
          'Verify that the root hash incorporates all transmitted polling unit ballots without omission.',
        ],
        actionLabel: 'Inspect Merkle Proofs',
        actionTab: 'results',
      },
      {
        step: 2,
        title: 'Tamper-Evident SHA-256 Audit Trail Inspection',
        shortDesc: 'Verify blockchain-like hash continuity across all administrative events.',
        details: [
          'Navigate to "Audit Trails & Blocks" in the sidebar.',
          'Review chronological events: ELECTION_GAZETTED, CANDIDATE_NOMINATED, VOTER_ACCREDITED, BALLOT_CAST.',
          'Check that every log entry contains a valid `previous_hash` pointing to the prior event’s hash.',
          'Verify that the green "CRYPTOGRAPHIC CHAIN INTEGRITY VALID" seal is active.',
        ],
        actionLabel: 'Inspect Audit Logs',
        actionTab: 'audit',
        tip: 'If any record was tampered with, the SHA-256 chain will break immediately and trigger an alarm.',
      },
      {
        step: 3,
        title: 'Turnout & Anomaly Statistical Analysis',
        shortDesc: 'Check for geographic anomalies, over-voting, or abnormal accreditation spikes.',
        details: [
          'Compare total votes cast against total accredited voters per Polling Unit, Ward, and LGA.',
          'Confirm that the accreditation ratio does not exceed 100% in any polling station.',
          'Analyze candidate vote margins and standard deviation curves across all 36 States + FCT.',
        ],
        actionLabel: 'View Analytics',
        actionTab: 'results',
      },
      {
        step: 4,
        title: 'Independent Citizen Receipt Sampling',
        shortDesc: 'Sample citizen receipts to prove mathematical ballot inclusion.',
        details: [
          'Use the "Receipt Validator" tool with randomly sampled citizen ballot hashes.',
          'Confirm that the validator outputs a valid Merkle inclusion proof.',
          'Verify that candidate choices remain cryptographically hidden while proof of counting is confirmed.',
        ],
        actionLabel: 'Test Receipt Validator',
        actionTab: 'verify-receipt',
      },
      {
        step: 5,
        title: 'Publish Independent Civic Observatory Report',
        shortDesc: 'Compile evidence-based findings and issue public certification statement.',
        details: [
          'Export audit logs, collation proofs, and Merkle hashes in CSV and JSON formats.',
          'Prepare your independent assessment for civil society organizations and media dissemination.',
        ],
        actionLabel: 'Export Schema / Logs',
        actionTab: 'schema',
      },
    ],
    securityNotes: [
      'Auditors operate in read-only and cryptographic verification mode; no vote data can be modified.',
      'All audit queries and data exports are logged for mutual institutional transparency.',
    ],
  },
};

export const RoleDocumentationModal: React.FC<RoleDocumentationModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'voter',
  onSelectAction,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize initialRole
  const currentDoc = ROLE_DOCS[selectedRole] || ROLE_DOCS.voter;

  const roleTabs = [
    { id: 'voter', label: '1. Citizen Voter', icon: Vote, jurisdiction: 'Elector & Secret Ballot' },
    { id: 'admin', label: '2. INEC Commission', icon: Building2, jurisdiction: 'Election Administration' },
    { id: 'auditor', label: '3. Independent Audit', icon: ShieldCheck, jurisdiction: 'Cryptographic Verification' },
  ];

  const handleAction = (tab?: string) => {
    if (tab && onSelectAction) {
      onSelectAction(tab);
      onClose();
    }
  };

  const filteredSteps = currentDoc.steps.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.shortDesc.toLowerCase().includes(q) ||
      s.details.some((d) => d.toLowerCase().includes(q))
    );
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Electoral System Documentation & Manual"
      subtitle="Complete Step-by-Step Task Guides for Every Role (From Start to Finish)"
      maxWidth="2xl"
      icon={<BookOpen className="h-5 w-5 text-[#168447]" />}
    >
      <div className="space-y-6 text-[#202522]">
        
        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-[#202522] uppercase tracking-wider mb-2">
            Select User Role Manual to Inspect:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {roleTabs.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r.id);
                    setActiveStepTab(1);
                  }}
                  className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#168447] bg-[#F1F7F2] text-[#168447] font-semibold'
                      : 'border-[#E3E8E4] bg-white hover:border-[#C4D6C9] text-[#202522]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 w-full">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs truncate font-medium">{r.label.split(' ')[0]}</span>
                  </div>
                  <span className="text-[10px] text-[#68716B] truncate w-full mt-1">
                    {r.jurisdiction}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Hero Banner */}
        <div className="bg-[#F6F7F6] border border-[#E3E8E4] rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3E8E4] pb-3">
            <div>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border ${currentDoc.badgeColor} mb-1`}>
                {currentDoc.badge}
              </span>
              <h3 className="text-base font-semibold text-[#202522]">{currentDoc.title}</h3>
              <p className="text-xs text-[#68716B]">{currentDoc.subtitle}</p>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="inline-flex items-center gap-1 rounded bg-white border border-[#E3E8E4] px-2 py-1 text-[11px] font-mono font-medium text-[#202522]">
                <Clock className="w-3 h-3 text-[#168447]" />
                <span>{currentDoc.steps.length} Key Steps</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-700 mt-3 leading-relaxed">
            {currentDoc.overview}
          </p>

          {/* Core Responsibilities */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
              Statutory Responsibilities &amp; Code of Conduct:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {currentDoc.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#008751] shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Search within steps */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search steps, actions, or procedures..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#008751] focus:outline-none"
            />
          </div>
        </div>

        {/* Step-by-Step Task Execution Guide */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>Step-by-Step Task Execution (Start to Finish)</span>
              <span className="text-slate-400 font-normal">• Sequential Progression</span>
            </h4>
          </div>

          <div className="space-y-3">
            {filteredSteps.map((stepItem) => {
              const isCurrent = activeStepTab === stepItem.step;
              return (
                <div
                  key={stepItem.step}
                  className={`border rounded-xl transition-colors ${
                    isCurrent ? 'border-[#008751] bg-white' : 'border-slate-200 bg-slate-50/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveStepTab(isCurrent ? 0 : stepItem.step)}
                    className="w-full p-3.5 flex items-start sm:items-center justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-bold ${
                        isCurrent
                          ? 'bg-[#008751] text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}>
                        {stepItem.step}
                      </span>
                      <div>
                        <h5 className="text-xs font-semibold text-slate-900">
                          Step {stepItem.step}: {stepItem.title}
                        </h5>
                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                          {stepItem.shortDesc}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isCurrent ? 'rotate-90 text-[#008751]' : ''}`} />
                  </button>

                  {isCurrent && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs text-slate-700 space-y-3">
                      <div className="space-y-2 pt-2">
                        {stepItem.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-[#008751] font-bold font-mono text-[11px] mt-0.5">
                              {stepItem.step}.{idx + 1}
                            </span>
                            <span className="text-slate-700 leading-relaxed">{detail}</span>
                          </div>
                        ))}
                      </div>

                      {stepItem.tip && (
                        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>Operational Tip:</strong> {stepItem.tip}</span>
                        </div>
                      )}

                      {stepItem.actionTab && (
                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleAction(stepItem.actionTab)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#008751] hover:bg-[#007043] px-3.5 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                          >
                            <span>{stepItem.actionLabel || 'Go to Task Tool'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Cryptographic Assurances */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#008751]" />
            <span>Cryptographic Guarantees &amp; Audit Protocols</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {currentDoc.securityNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#008751]">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <p className="text-[11px] text-slate-500 font-mono">
            Electoral Act 2026 Compliant • End-to-End Cryptographically Verifiable (E2E-V)
          </p>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </Modal>
  );
};
