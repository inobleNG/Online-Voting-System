import React, { useState } from 'react';
import {
  Vote,
  CheckCircle2,
  ShieldCheck,
  Download,
  ExternalLink,
  ArrowRight,
  FileText,
  UserCheck,
  QrCode,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useElection } from '../../context/ElectionContext';
import { Candidate, Position } from '../../types';
import { CandidateProfileModal } from './CandidateProfileModal';
import { generateVoterReceiptPDF } from '../../lib/pdfGenerator';
import { NigeriaFlag } from '../common/NigeriaCrest';

interface VoterDashboardProps {
  onEnterVotingBooth: (electionId: string) => void;
  onViewResults: (electionId: string) => void;
  onVerifyReceipt: () => void;
}

export const VoterDashboard: React.FC<VoterDashboardProps> = ({
  onEnterVotingBooth,
  onViewResults,
  onVerifyReceipt,
}) => {
  const { currentUser } = useAuth();
  const {
    elections,
    positions,
    candidates,
    voterRoll,
    receipts,
  } = useElection();

  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<Candidate | null>(null);
  const [selectedCandidatePosition, setSelectedCandidatePosition] = useState<Position | undefined>(undefined);

  // Active election
  const activeElection = elections[0] || null;

  // Find current voter's accreditation record
  const currentRecord = voterRoll.find(
    (v) =>
      v.user_id === currentUser?.id ||
      v.voter_id === currentUser?.voter_id ||
      v.vin_number === currentUser?.vin_number ||
      v.email === currentUser?.email
  ) || voterRoll[0];

  const hasVoted = currentRecord?.has_voted;
  const myReceipt = receipts.find(
    (r) => r.user_id === currentUser?.id || r.receipt_hash === currentRecord?.receipt_hash
  );

  const primaryPosition = positions.find((p) => p.election_id === activeElection?.id);
  const electionCandidates = candidates.filter(
    (c) => c.election_id === activeElection?.id && c.position_id === primaryPosition?.id
  );

  return (
    <div className="space-y-6 text-[#202522] max-w-5xl mx-auto py-2">
      
      {/* 1. Elector Profile Banner */}
      <div className="bg-white border border-[#E3E8E4] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E8E4] pb-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt=""
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#E3E8E4]"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <NigeriaFlag width={20} height={14} />
                <span className="text-xs font-bold uppercase tracking-wider text-[#168447]">
                  Accredited Citizen Elector
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#202522] tracking-tight">
                {currentUser?.full_name || currentRecord?.full_name || 'Hajiya Amina Bello'}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#68716B]">
                Federal Republic of Nigeria • Electronic Voter Register
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs ${
              hasVoted
                ? 'bg-[#E7F3EB] text-[#168447] border border-[#C4D6C9]'
                : 'bg-[#F1F7F2] text-[#168447] border border-[#E3E8E4]'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>{hasVoted ? 'BALLOT RECORDED & SEALED' : 'ACCREDITED & READY TO VOTE'}</span>
            </div>
          </div>
        </div>

        {/* Voter Registration Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#F6F7F6] border border-[#E3E8E4]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#68716B]">
              Voter ID (VIN)
            </div>
            <div className="text-base font-bold font-mono text-[#202522] mt-1">
              {currentRecord?.vin_number || currentRecord?.voter_id || '90F5 B028 1429 8812 041'}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#F6F7F6] border border-[#E3E8E4]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#68716B]">
              Assigned Polling Unit
            </div>
            <div className="text-base font-bold text-[#202522] mt-1">
              {currentRecord?.polling_unit || 'PU: 19/02/04/001 (Kano)'}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#F6F7F6] border border-[#E3E8E4]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#68716B]">
              Confidential Voting PIN
            </div>
            <div className="text-base font-bold font-mono text-[#168447] mt-1">
              {currentRecord?.verification_pin || '884129'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Action Card: Active Election */}
      <div className="bg-white border border-[#E3E8E4] rounded-xl p-6 sm:p-8">
        {!hasVoted ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#168447]">
                Active Election Available
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#202522]">
                {activeElection?.title || '2026 Presidential Election'}
              </h2>
              <p className="text-sm text-[#68716B]">
                Your accreditation is valid. Step into the isolated digital voting booth to select your candidate.
              </p>
            </div>

            <button
              type="button"
              onClick={() => activeElection && onEnterVotingBooth(activeElection.id)}
              className="py-3.5 px-6 rounded-lg bg-[#168447] hover:bg-[#116B39] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <Vote className="w-5 h-5" />
              <span>Proceed to Voting Booth →</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#168447]">
                Official Balloting Record
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#202522] flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#168447]" />
                <span>Your Ballot Has Been Cast &amp; Sealed</span>
              </h2>
              <p className="text-sm text-[#68716B]">
                Your ballot was cryptographically encrypted with SHA-256 and committed into the national Merkle ledger.
              </p>
              {currentRecord?.receipt_hash && (
                <div className="text-xs font-mono text-[#68716B] truncate max-w-md pt-1">
                  Receipt Hash: {currentRecord.receipt_hash}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onVerifyReceipt}
                className="py-2.5 px-4 rounded-lg border border-[#168447] text-[#168447] hover:bg-[#F1F7F2] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Verify Receipt Hash</span>
              </button>
              {myReceipt && (
                <button
                  type="button"
                  onClick={() => generateVoterReceiptPDF(myReceipt)}
                  className="py-2.5 px-4 rounded-lg bg-[#202522] hover:bg-[#151916] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Receipt</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Contesting Candidates Showcase */}
      <div className="bg-white border border-[#E3E8E4] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E3E8E4] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#202522]">
              Contesting Nominees &amp; Manifestos
            </h2>
            <p className="text-xs sm:text-sm text-[#68716B] mt-0.5">
              Review candidates and their official policy manifestos before entering the booth
            </p>
          </div>
          <button
            type="button"
            onClick={() => activeElection && onViewResults(activeElection.id)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#168447] hover:underline cursor-pointer"
          >
            <span>View Live Tally</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {electionCandidates.slice(0, 4).map((cand) => (
            <div
              key={cand.id}
              className="p-5 rounded-lg border border-[#E3E8E4] bg-white hover:border-[#168447] transition-colors space-y-3 cursor-pointer"
              onClick={() => {
                setSelectedCandidateForModal(cand);
                setSelectedCandidatePosition(primaryPosition);
              }}
            >
              <div className="flex items-start gap-4">
                <img
                  src={cand.photo_url}
                  alt={cand.full_name}
                  className="w-16 h-16 rounded-lg object-cover border border-[#E3E8E4]"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-base font-bold text-[#202522] truncate">
                    {cand.full_name}
                  </div>
                  <div className="text-xs font-semibold text-[#68716B] mt-0.5">
                    <span className="font-bold text-[#168447] mr-1.5">
                      {cand.political_party_acronym || cand.political_party}
                    </span>
                    <span>• {cand.political_party}</span>
                  </div>
                  <p className="text-xs text-[#68716B] line-clamp-2 mt-1.5">
                    {cand.motto}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E3E8E4] flex items-center justify-between text-xs font-bold text-[#168447]">
                <span>Click to view profile &amp; manifesto</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Profile Modal */}
      {selectedCandidateForModal && (
        <CandidateProfileModal
          candidate={selectedCandidateForModal}
          position={selectedCandidatePosition}
          isOpen={!!selectedCandidateForModal}
          onClose={() => setSelectedCandidateForModal(null)}
          onSelectForVote={() => {
            setSelectedCandidateForModal(null);
            if (activeElection) onEnterVotingBooth(activeElection.id);
          }}
        />
      )}

    </div>
  );
};
