import React from 'react';
import {
  Users,
  Vote,
  ShieldCheck,
  Award,
  ArrowRight,
  FileCheck,
  Settings
} from 'lucide-react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { generateElectionResultsPDF } from '../../lib/pdfGenerator';
import { NigeriaFlag } from '../common/NigeriaCrest';

interface AdminDashboardProps {
  onNavigateToElections?: () => void;
  onNavigateToVoters?: () => void;
  onNavigateToAudit?: () => void;
  onNavigateToResults?: () => void;
  onNavigateToSettings?: () => void;
  setActiveTab?: (tab: string) => void;
  onOpenCreateElection?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToElections,
  onNavigateToVoters,
  onNavigateToAudit,
  onNavigateToResults,
  onNavigateToSettings,
  setActiveTab,
}) => {
  const { currentUser } = useAuth();
  const {
    selectedElection,
    candidates,
    positions,
    isChainValid,
    voterRoll,
  } = useElection();

  const handleNavCandidates = onNavigateToElections || (() => setActiveTab && setActiveTab('candidates'));
  const handleNavVoters = onNavigateToVoters || (() => setActiveTab && setActiveTab('voters'));
  const handleNavAudit = onNavigateToAudit || (() => setActiveTab && setActiveTab('audit'));
  const handleNavResults = onNavigateToResults || (() => setActiveTab && setActiveTab('results'));
  const handleNavSettings = onNavigateToSettings || (() => setActiveTab && setActiveTab('settings'));

  const primaryPosition = positions.find((p) => p.election_id === selectedElection?.id);
  const primaryCandidates = candidates.filter(
    (c) => c.election_id === selectedElection?.id && c.position_id === primaryPosition?.id
  );

  const totalRegistered = selectedElection?.max_registered_voters || 250000;
  const totalVotesCast = selectedElection?.total_votes_cast || 14820;
  const turnoutPercent = totalRegistered > 0 ? ((totalVotesCast / totalRegistered) * 100).toFixed(1) : '5.9';

  const maxCandidateVotes = Math.max(...primaryCandidates.map((c) => c.vote_count || 0), 1);

  return (
    <div className="space-y-6 text-[#202522] max-w-5xl mx-auto py-2">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#E3E8E4] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <NigeriaFlag width={22} height={14} />
            <span className="text-xs font-bold uppercase tracking-wider text-[#168447]">
              INEC Administrative Command
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202522] tracking-tight">
            INEC Election Command Dashboard
          </h1>
          <p className="text-sm text-[#68716B] mt-1">
            Active Session: <strong className="text-[#202522]">{selectedElection?.title || 'National Presidential Election 2026'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => selectedElection && generateElectionResultsPDF(selectedElection, positions, candidates, voterRoll)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E3E8E4] bg-white hover:bg-[#F6F7F6] text-xs font-bold text-[#202522] cursor-pointer transition-colors"
          >
            <FileCheck className="w-4 h-4 text-[#168447]" />
            <span>Export Official PDF Report</span>
          </button>
        </div>
      </div>

      {/* 2. Three Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Votes */}
        <div className="bg-white border border-[#E3E8E4] rounded-xl p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#68716B]">
              Total Ballots Cast
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F1F7F2] flex items-center justify-center text-[#168447]">
              <Vote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#202522] tabular-nums">
            {totalVotesCast.toLocaleString()}
          </div>
          <div className="text-xs text-[#68716B] font-medium">
            {turnoutPercent}% Verified Voter Turnout
          </div>
        </div>

        {/* Registered Voters */}
        <div className="bg-white border border-[#E3E8E4] rounded-xl p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#68716B]">
              Registered Voters
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F1F7F2] flex items-center justify-center text-[#168447]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#202522] tabular-nums">
            {totalRegistered.toLocaleString()}
          </div>
          <div className="text-xs text-[#68716B] font-medium">
            Eligible PVC / Biometric Electors
          </div>
        </div>

        {/* Cryptographic Integrity */}
        <div className="bg-white border border-[#E3E8E4] rounded-xl p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#68716B]">
              Cryptographic Integrity
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F1F7F2] flex items-center justify-center text-[#168447]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#168447]">
            {isChainValid ? 'SHA-256 SEALED' : 'UNVERIFIED'}
          </div>
          <div className="text-xs text-[#68716B] font-medium">
            Tamper-evident blockchain ledger
          </div>
        </div>
      </div>

      {/* 3. Live Candidate Standings */}
      <div className="bg-white border border-[#E3E8E4] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3E8E4] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#202522]">
              Live Candidate Vote Standings
            </h2>
            <p className="text-xs sm:text-sm text-[#68716B] mt-0.5">
              Office: {primaryPosition?.title || 'Presidential Election'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleNavResults}
            className="flex items-center gap-1.5 text-xs font-bold text-[#168447] hover:underline cursor-pointer"
          >
            <span>View detailed analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {primaryCandidates.map((cand) => {
            const votes = cand.vote_count || 0;
            const percent = totalVotesCast > 0 ? ((votes / totalVotesCast) * 100).toFixed(1) : '0';
            const barWidth = Math.max((votes / maxCandidateVotes) * 100, 4);

            return (
              <div key={cand.id} className="p-4 rounded-lg border border-[#E3E8E4] bg-white space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={cand.photo_url}
                      alt={cand.full_name}
                      className="w-12 h-12 rounded-lg object-cover border border-[#E3E8E4]"
                    />
                    <div>
                      <div className="text-base font-bold text-[#202522]">
                        {cand.full_name}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#68716B]">
                        <span className="font-bold text-[#168447]">
                          {cand.political_party_acronym || cand.political_party}
                        </span>
                        <span>•</span>
                        <span>{cand.political_party}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:self-center">
                    <div className="text-lg sm:text-xl font-bold text-[#202522] tabular-nums">
                      {votes.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-[#68716B]">votes</span>
                    </div>
                    <div className="text-xs font-bold text-[#168447]">
                      {percent}% of total
                    </div>
                  </div>
                </div>

                {/* Flat Progress Bar */}
                <div className="w-full bg-[#E3E8E4] h-2 rounded-sm overflow-hidden">
                  <div
                    className="bg-[#168447] h-full transition-all duration-300"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={handleNavCandidates}
          className="p-5 rounded-xl bg-white border border-[#E3E8E4] hover:border-[#168447] transition-colors text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-[#F1F7F2] text-[#168447] flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-[#202522] group-hover:text-[#168447] flex items-center justify-between">
            <span>Candidates</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          <p className="text-xs text-[#68716B] mt-1">
            Review nominee profiles, manifestos, and parties.
          </p>
        </button>

        <button
          type="button"
          onClick={handleNavVoters}
          className="p-5 rounded-xl bg-white border border-[#E3E8E4] hover:border-[#168447] transition-colors text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-[#F1F7F2] text-[#168447] flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-[#202522] group-hover:text-[#168447] flex items-center justify-between">
            <span>Voter Register</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          <p className="text-xs text-[#68716B] mt-1">
            View accredited voters, VIN numbers, and status.
          </p>
        </button>

        <button
          type="button"
          onClick={handleNavAudit}
          className="p-5 rounded-xl bg-white border border-[#E3E8E4] hover:border-[#168447] transition-colors text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-[#F1F7F2] text-[#168447] flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-[#202522] group-hover:text-[#168447] flex items-center justify-between">
            <span>Audit Ledger</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          <p className="text-xs text-[#68716B] mt-1">
            Inspect cryptographic block hashes and chain continuity.
          </p>
        </button>

        <button
          type="button"
          onClick={handleNavSettings}
          className="p-5 rounded-xl bg-white border border-[#E3E8E4] hover:border-[#168447] transition-colors text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-[#F1F7F2] text-[#168447] flex items-center justify-center mb-3">
            <Settings className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-[#202522] group-hover:text-[#168447] flex items-center justify-between">
            <span>Admin Settings</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          <p className="text-xs text-[#68716B] mt-1">
            Configure election rules, 2FA PINs, and database reset.
          </p>
        </button>
      </div>

    </div>
  );
};
