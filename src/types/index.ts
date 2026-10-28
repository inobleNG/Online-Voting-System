export type UserRole = 'admin' | 'officer' | 'voter' | 'auditor' | 'rec' | 'spo';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  voter_id: string; // e.g., "VTR-2026-8841" or VIN
  vin_number?: string; // Voter Identification Number e.g. "90F5 B028 1429 8812 041"
  nin_number?: string; // National Identification Number e.g. "74921094812"
  state?: string; // e.g. "Lagos State"
  lga?: string; // Local Government Area e.g. "Ikeja"
  ward?: string;
  polling_unit?: string; // e.g. "PU: 24/08/01/012"
  department?: string;
  constituency?: string;
  status: 'verified' | 'pending' | 'suspended';
  two_factor_enabled: boolean;
  avatar_url?: string;
  created_at: string;
}

export type ElectionStatus = 'draft' | 'upcoming' | 'active' | 'paused' | 'completed' | 'certified';

export interface Election {
  id: string;
  title: string;
  code: string; // e.g., "NAT-PRES-2026"
  description: string;
  category: 'General' | 'University' | 'Corporate' | 'Association' | 'Union';
  status: ElectionStatus;
  start_time: string;
  end_time: string;
  banner_url?: string;
  allow_realtime_results: boolean;
  require_pin_verification: boolean;
  max_registered_voters: number;
  total_votes_cast: number;
  created_by: string;
  created_at: string;
  certified_by?: string;
  certified_at?: string;
  merkle_root_hash?: string;
  merkle_root?: string;
}

export interface Position {
  id: string;
  election_id: string;
  title: string;
  description?: string;
  max_choices: number; // e.g., 1 for President, 3 for Senators
  min_choices: number;
  display_order: number;
  required: boolean;
}

export interface Candidate {
  id: string;
  election_id: string;
  position_id: string;
  full_name: string;
  running_mate?: string;
  ballot_number: number;
  photo_url: string;
  political_party: string;
  political_party_acronym?: string;
  state_of_origin?: string;
  motto: string;
  biography: string;
  manifesto_points: string[];
  manifesto_pdf_url?: string;
  manifesto_pdf_name?: string;
  manifesto_text?: string;
  status: 'active' | 'withdrawn' | 'disqualified';
  vote_count?: number;
}

export interface VoterEligibility {
  id: string;
  election_id: string;
  user_id?: string;
  voter_id: string;
  vin_number?: string;
  nin_number?: string;
  full_name: string;
  email: string;
  phone?: string;
  state?: string;
  lga?: string;
  ward?: string;
  polling_unit?: string;
  department: string;
  passport_photo?: string;
  has_voted: boolean;
  voted_at?: string;
  receipt_hash?: string;
  verification_pin: string;
  status: 'eligible' | 'registered' | 'blocked';
}

export interface CastVoteSelection {
  position_id: string;
  candidate_ids: string[];
}

export interface EncryptedVoteRecord {
  id: string;
  election_id: string;
  position_id: string;
  candidate_id: string;
  anonymous_token: string;
  timestamp: string;
  block_hash: string;
}

export interface VoteReceipt {
  id?: string;
  receipt_id: string; // Public verification token e.g. "VOTE-A79B-89EF-4412"
  user_id?: string;
  election_id: string;
  election_title: string;
  timestamp: string;
  receipt_hash: string; // SHA-256 checksum
  block_height: number;
  verification_status: 'confirmed' | 'tallied';
  selections_summary: {
    position_title: string;
    candidate_name: string;
  }[];
}

export type AuditSeverity = 'info' | 'warn' | 'critical';

export interface AuditLog {
  id: string;
  timestamp: string;
  actor_id: string;
  actor_name: string;
  actor_role: UserRole | 'system';
  action: string;
  module: 'AUTH' | 'ELECTION' | 'VOTING' | 'CANDIDATE' | 'VOTER_ROLL' | 'SECURITY' | 'TALLY';
  details: string;
  ip_address: string;
  previous_hash: string;
  hash: string;
  severity: AuditSeverity;
}

export interface ElectionTally {
  election_id: string;
  total_registered: number;
  total_votes_cast: number;
  turnout_percentage: number;
  abstained_count: number;
  positions: {
    position_id: string;
    position_title: string;
    max_choices: number;
    total_votes: number;
    candidates: {
      candidate_id: string;
      full_name: string;
      political_party: string;
      photo_url: string;
      votes: number;
      percentage: number;
      is_winner: boolean;
    }[];
  }[];
}

export interface SystemSecurityMetrics {
  encryption_standard: string;
  sha256_integrity_status: 'verified' | 'warning' | 'error';
  audit_chain_valid: boolean;
  total_audit_records: number;
  duplicate_attempts_blocked: number;
  last_security_scan: string;
  rls_active: boolean;
}
