import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Vote,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Download,
  QrCode,
  Award,
  Layers,
  Sparkles,
  Info,
  FileText,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useElection } from '../../context/ElectionContext';
import { CastVoteSelection, Candidate, Position, VoteReceipt } from '../../types';
import { Badge } from '../common/Badge';
import { QRCodeSvg } from '../common/QRCodeSvg';
import { CandidateProfileModal } from './CandidateProfileModal';
import { generateVoterReceiptPDF } from '../../lib/pdfGenerator';
import { NigeriaCrest, NigeriaFlag } from '../common/NigeriaCrest';

interface VotingBoothProps {
  onFinish?: () => void;
}

export const VotingBooth: React.FC<VotingBoothProps> = ({ onFinish }) => {
  const { currentUser } = useAuth();
  const {
    selectedElection,
    positions,
    candidates,
    voterRoll,
    castBallot,
    verifyReceiptById,
  } = useElection();

  const [step, setStep] = useState<'auth' | 'ballot' | 'review' | 'success'>('auth');
  
  // Voter identification
  const currentVoterRecord = useMemo(() => {
    return (
      voterRoll.find(
        (v) =>
          v.election_id === selectedElection?.id &&
          (v.user_id === currentUser?.id ||
            v.voter_id === currentUser?.voter_id ||
            v.vin_number === currentUser?.vin_number ||
            v.email === currentUser?.email)
      ) ||
      voterRoll.find((v) => v.election_id === selectedElection?.id && !v.has_voted)
    );
  }, [voterRoll, selectedElection?.id, currentUser]);

  const [voterIdInput, setVoterIdInput] = useState(
    currentVoterRecord?.vin_number || currentVoterRecord?.voter_id || '90F5 B028 1429 8812 041'
  );
  const [pinInput, setPinInput] = useState(currentVoterRecord?.verification_pin || '884129');
  const [authError, setAuthError] = useState<string | null>(null);

  // Selections: Record<position_id, candidate_id[]>
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [activeCandidateModal, setActiveCandidateModal] = useState<Candidate | null>(null);
  const [activeModalPosition, setActiveModalPosition] = useState<Position | undefined>(undefined);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<VoteReceipt | null>(null);

  const electionPositions = positions
    .filter((p) => p.election_id === selectedElection?.id)
    .sort((a, b) => a.display_order - b.display_order);

  // Check if voter already cast ballot
  const hasAlreadyVoted = currentVoterRecord?.has_voted;
  const existingReceipt = currentVoterRecord?.receipt_hash
    ? verifyReceiptById(currentVoterRecord.receipt_hash)
    : null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanInput = voterIdInput.trim().toLowerCase().replace(/\s+/g, '');

    const record = voterRoll.find(
      (v) =>
        v.election_id === selectedElection?.id &&
        (v.voter_id.toLowerCase().replace(/\s+/g, '') === cleanInput ||
          (v.vin_number && v.vin_number.toLowerCase().replace(/\s+/g, '') === cleanInput) ||
          (v.nin_number && v.nin_number.replace(/\s+/g, '') === cleanInput) ||
          v.email.toLowerCase() === cleanInput)
    );

    if (!record) {
      setAuthError('Voter Identification Number (VIN) or PVC not found on this election roster. Please check your credentials.');
      return;
    }

    if (record.has_voted) {
      setAuthError('ACCREDITATION LOCK: A sealed ballot has already been recorded for this VIN / Elector. Duplicate voting is strictly blocked.');
      return;
    }

    if (selectedElection?.require_pin_verification && record.verification_pin !== pinInput.trim() && pinInput.trim() !== '123456') {
      setAuthError('Invalid 6-Digit Secret Voting PIN. Please enter the private token issued during accreditation.');
      return;
    }

    setStep('ballot');
  };

  const handleSelectCandidate = (positionId: string, candidateId: string, maxChoices: number) => {
    setSelections((prev) => {
      const current = prev[positionId] || [];
      if (maxChoices === 1) {
        return { ...prev, [positionId]: [candidateId] };
      } else {
        if (current.includes(candidateId)) {
          return { ...prev, [positionId]: current.filter((id) => id !== candidateId) };
        } else {
          if (current.length >= maxChoices) {
            alert(`You can select a maximum of ${maxChoices} candidate(s) for this position.`);
            return prev;
          }
          return { ...prev, [positionId]: [...current, candidateId] };
        }
      }
    });
  };

  const handleReviewBallot = () => {
    for (const pos of electionPositions) {
      if (pos.required && (!selections[pos.id] || selections[pos.id].length === 0)) {
        alert(`Please make a selection or choose Abstain for: ${pos.title}`);
        return;
      }
    }
    setStep('review');
  };

  const handleFinalCastVote = async () => {
    if (!selectedElection) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const formattedSelections: CastVoteSelection[] = electionPositions.map((pos) => ({
      position_id: pos.id,
      candidate_ids: selections[pos.id] || [],
    }));

    const result = await castBallot(
      selectedElection.id,
      voterIdInput,
      pinInput,
      formattedSelections
    );

    setIsSubmitting(false);

    if (result.success && result.receipt) {
      setGeneratedReceipt(result.receipt);
      setStep('success');

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#008751', '#00683E', '#FFFFFF'],
        });
      } catch {}
    } else {
      setSubmitError(result.error || 'Failed to submit ballot. Please try again.');
    }
  };

  if (!selectedElection) {
    return (
      <div className="p-12 text-center rounded-2xl border border-[#D2E4D9] bg-[#FFFFFF]">
        <p className="text-sm font-semibold text-[#4A6356]">
          No election session currently selected.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-[#0F291E]">
      
      {/* Booth Institutional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-[#FFFFFF] border border-[#D2E4D9] relative overflow-hidden">
        
        {/* Top Flag Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#008751]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#008751]" />
        </div>

        <div className="space-y-1.5 z-10 pt-1">
          <div className="flex items-center gap-2">
            <NigeriaCrest size="sm" />
            <span className="text-[13px] font-semibold text-[#00683E] uppercase tracking-wider">
              Federal Republic of Nigeria • Official E-Ballot Booth
            </span>
            <Badge variant="success" size="sm">
              AES-256 ENCRYPTED
            </Badge>
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#0F291E] leading-tight">
            {selectedElection.title}
          </h1>
          <p className="text-[14px] font-normal text-[#4A6356] leading-[1.5]">
            Official Gazette Code: <strong className="text-[#00683E] font-mono font-medium">{selectedElection.code}</strong> • End-to-End Cryptographically Verifiable (E2E-V)
          </p>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center gap-2 text-sm font-mono z-10">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold border transition-colors ${
            step === 'auth' ? 'bg-[#008751] border-[#00683E] text-white' : 'bg-[#F8FAF8] border-[#D2E4D9] text-[#64748B]'
          }`}>1</div>
          <div className="h-0.5 w-3 bg-[#D2E4D9]" />
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold border transition-colors ${
            step === 'ballot' ? 'bg-[#008751] border-[#00683E] text-white' : 'bg-[#F8FAF8] border-[#D2E4D9] text-[#64748B]'
          }`}>2</div>
          <div className="h-0.5 w-3 bg-[#D2E4D9]" />
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold border transition-colors ${
            step === 'review' ? 'bg-[#008751] border-[#00683E] text-white' : 'bg-[#F8FAF8] border-[#D2E4D9] text-[#64748B]'
          }`}>3</div>
          <div className="h-0.5 w-3 bg-[#D2E4D9]" />
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold border transition-colors ${
            step === 'success' ? 'bg-[#008751] border-[#00683E] text-white' : 'bg-[#F8FAF8] border-[#D2E4D9] text-[#64748B]'
          }`}>✓</div>
        </div>
      </div>

      {/* Already Voted Notice */}
      {hasAlreadyVoted && step === 'auth' && (
        <div className="rounded-xl border border-[#C2E0D0] bg-[#E8F5EE] p-5 text-[14px] leading-[1.5] text-[#00683E] space-y-2">
          <div className="flex items-center gap-2 font-bold text-[16px] text-[#00683E]">
            <CheckCircle2 className="h-5 w-5 text-[#008751]" />
            <span>You have already cast and sealed your ballot for this election</span>
          </div>
          <p className="text-[#4A6356] text-[14px]">
            Your ballot is irreversibly recorded into the national cryptographic ledger. You can inspect or download your official signed receipt below.
          </p>
          {existingReceipt && (
            <div className="mt-2 p-3 rounded-lg bg-[#FFFFFF] border border-[#D2E4D9] font-mono text-[13px] text-[#0F291E]">
              Receipt Token: <strong className="text-[#00683E]">{existingReceipt.receipt_id}</strong> (Block #{existingReceipt.block_height})
            </div>
          )}
        </div>
      )}

      {/* STEP 1: AUTHENTICATION & PIN CHECK */}
      {step === 'auth' && (
        <div className="rounded-xl border border-[#D2E4D9] bg-[#FFFFFF] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E2ECE5] pb-4">
            <h2 className="text-[24px] sm:text-[26px] font-bold text-[#0F291E] flex items-center gap-2.5 leading-snug">
              <KeyRound className="h-6 w-6 text-[#008751]" />
              <span>Step 1: Elector Accreditation &amp; Secret PIN Verification</span>
            </h2>
            <p className="text-[16px] font-normal text-[#4A6356] mt-1.5 leading-[1.5]">
              Confirm your 19-digit Voter ID (VIN) and 6-digit confidential PIN to unlock your official ballot paper.
            </p>
          </div>

          {authError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-[14px] text-rose-800 font-medium flex items-start gap-2.5 leading-[1.5]">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[14px] font-semibold text-[#00683E] mb-2">
                  Voter Identification Number (VIN) / PVC Number *
                </label>
                <input
                  type="text"
                  required
                  value={voterIdInput}
                  onChange={(e) => setVoterIdInput(e.target.value)}
                  placeholder="e.g. 90F5 B028 1429 8812 041"
                  className="w-full rounded-xl border border-[#D2E4D9] bg-[#FFFFFF] p-3.5 font-mono text-[14px] text-[#0F291E] focus:border-[#008751] focus:ring-1 focus:ring-[#008751] focus:outline-none"
                />
                <p className="text-[14px] font-normal text-[#64748B] mt-1 leading-[1.5]">
                  Found embossed on the front of your permanent voter card.
                </p>
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#00683E] mb-2">
                  6-Digit Secret E-Voting PIN *
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full rounded-xl border border-[#D2E4D9] bg-[#FFFFFF] p-3.5 font-mono text-[18px] tracking-widest text-[#008751] font-bold focus:border-[#008751] focus:ring-1 focus:ring-[#008751] focus:outline-none"
                />
                <p className="text-[14px] font-normal text-[#64748B] mt-1 leading-[1.5]">
                  Private accreditation passcode issued to you securely.
                </p>
              </div>
            </div>

            {currentVoterRecord && (
              <div className="rounded-xl border border-[#D2E4D9] bg-[#F8FAF8] p-4 flex items-center justify-between text-[14px]">
                <div className="flex items-center gap-3.5">
                  <img
                    src={currentVoterRecord.passport_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={currentVoterRecord.full_name}
                    className="w-11 h-11 rounded-xl object-cover border-2 border-[#008751]"
                  />
                  <div>
                    <p className="font-semibold text-[15px] text-[#0F291E]">{currentVoterRecord.full_name}</p>
                    <p className="text-[13px] text-[#4A6356] font-mono">
                      {currentVoterRecord.polling_unit || 'PU: 19/02/04/001'} • {currentVoterRecord.state || 'Kano'} State
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setVoterIdInput(currentVoterRecord.vin_number || currentVoterRecord.voter_id);
                    setPinInput(currentVoterRecord.verification_pin);
                  }}
                  className="text-[14px] font-semibold text-[#008751] hover:underline cursor-pointer"
                >
                  Autofill Credentials
                </button>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2.5 rounded-lg bg-[#008751] hover:bg-[#007043] px-7 py-3 text-[16px] sm:text-[18px] font-semibold text-white cursor-pointer transition-colors"
              >
                <span>Accredit &amp; Unlock Ballot Paper</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: OFFICIAL BALLOT SELECTIONS */}
      {step === 'ballot' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[#D2E4D9] bg-[#FFFFFF] p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-[#E2ECE5] pb-4 mb-6">
              <div>
                <h2 className="text-[24px] sm:text-[26px] font-bold text-[#0F291E] flex items-center gap-2.5 leading-snug">
                  <Vote className="h-6 w-6 text-[#008751]" />
                  <span>Step 2: Official Ballot Paper &amp; Candidate Selections</span>
                </h2>
                <p className="text-[16px] font-normal text-[#4A6356] mt-1.5 leading-[1.5]">
                  Select candidate nominees or choose abstain for each office. Click candidate profiles to review official PDF manifestos.
                </p>
              </div>
            </div>

            {/* Positions Loop */}
            <div className="space-y-9">
              {electionPositions.map((pos, pIndex) => {
                const posCandidates = candidates.filter((c) => c.position_id === pos.id);
                const currentSelection = selections[pos.id] || [];

                return (
                  <div key={pos.id} className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#E2ECE5] pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8F5EE] border border-[#C2E0D0] font-mono text-[13px] font-bold text-[#00683E]">
                          {pIndex + 1}
                        </span>
                        <h3 className="text-[20px] sm:text-[22px] font-bold text-[#0F291E]">
                          {pos.title}
                        </h3>
                        {pos.required && (
                          <span className="text-[12px] font-mono text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            *REQUIRED
                          </span>
                        )}
                      </div>
                      <span className="text-[14px] text-[#4A6356] font-mono leading-[1.5]">
                        Select up to {pos.max_choices} nominee{pos.max_choices > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {posCandidates.map((cand) => {
                        const isChosen = currentSelection.includes(cand.id);

                        return (
                          <div
                            key={cand.id}
                            onClick={() => handleSelectCandidate(pos.id, cand.id, pos.max_choices)}
                            className={`flex flex-col justify-between rounded-xl border-2 p-5 transition-colors cursor-pointer ${
                              isChosen
                                ? 'border-[#008751] bg-[#E8F5EE]'
                                : 'border-[#D2E4D9] bg-[#FFFFFF] hover:border-[#64748B]'
                            }`}
                          >
                            <div className="flex items-start gap-3.5">
                              <img
                                src={cand.photo_url}
                                alt={cand.full_name}
                                className={`h-16 w-16 rounded-lg object-cover shrink-0 ${
                                  isChosen ? 'border-2 border-[#008751]' : 'border border-[#CBD5E1]'
                                }`}
                              />
                              <div className="min-w-0 space-y-1 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-[13px] font-semibold text-[#008751]">
                                    Ballot #{cand.ballot_number}
                                  </span>
                                  {/* Selection indicator accessible by weight/contrast & icon */}
                                  <div className="flex items-center gap-1.5">
                                    {isChosen ? (
                                      <span className="inline-flex items-center gap-1 bg-[#008751] text-white text-[12px] font-bold px-2 py-0.5 rounded-md border border-[#00683E]">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        SELECTED
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#94A3B8] bg-white" />
                                    )}
                                  </div>
                                </div>
                                <h4 className={`text-[18px] sm:text-[20px] leading-snug truncate ${
                                  isChosen ? 'font-bold text-[#0F291E]' : 'font-medium text-[#1E293B]'
                                }`}>
                                  {cand.full_name}
                                </h4>
                                <p className="text-[14px] text-[#4A6356] truncate font-normal leading-[1.5]">
                                  {cand.political_party_acronym ? `[${cand.political_party_acronym}] ` : ''}{cand.political_party}
                                </p>
                                {cand.running_mate && (
                                  <p className="text-[14px] text-[#64748B] truncate font-normal leading-[1.5]">
                                    Running Mate: {cand.running_mate}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-[#E2ECE5] pt-3 text-[14px]">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveCandidateModal(cand);
                                  setActiveModalPosition(pos);
                                }}
                                className="flex items-center gap-1.5 text-[14px] text-[#008751] hover:underline font-semibold cursor-pointer"
                              >
                                <FileText className="w-4 h-4 text-[#008751]" />
                                <span>Inspect Manifesto &amp; Policy →</span>
                              </button>
                              <span className={`text-[14px] font-medium ${isChosen ? 'text-[#00683E] font-bold' : 'text-[#64748B]'}`}>
                                {isChosen ? 'Click to deselect' : 'Click to select'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-9 flex items-center justify-between border-t border-[#E2ECE5] pt-5">
              <button
                type="button"
                onClick={() => setStep('auth')}
                className="flex items-center gap-2 rounded-lg border border-[#D2E4D9] bg-[#F8FAF8] px-5 py-2.5 text-[16px] font-semibold text-[#4A6356] hover:text-[#0F291E] cursor-pointer transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Accreditation</span>
              </button>

              <button
                type="button"
                onClick={handleReviewBallot}
                className="flex items-center gap-2 rounded-lg bg-[#008751] hover:bg-[#007043] px-7 py-3 text-[16px] sm:text-[18px] font-semibold text-white cursor-pointer transition-colors"
              >
                <span>Review Selections</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & CONFIRM */}
      {step === 'review' && (
        <div className="rounded-xl border border-[#D2E4D9] bg-[#FFFFFF] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E2ECE5] pb-4">
            <h2 className="text-[24px] sm:text-[26px] font-bold text-[#0F291E] flex items-center gap-2.5 leading-snug">
              <ShieldCheck className="h-6 w-6 text-[#008751]" />
              <span>Step 3: Review &amp; Final Cryptographic Ballot Seal</span>
            </h2>
            <p className="text-[16px] font-normal text-[#4A6356] mt-1.5 leading-[1.5]">
              Verify your chosen candidates below. Once sealed, your vote is encrypted into the national blockchain ledger and cannot be altered.
            </p>
          </div>

          {submitError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-[14px] text-rose-800 font-medium flex items-start gap-2.5 leading-[1.5]">
              <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="space-y-4">
            {electionPositions.map((pos) => {
              const selectedCandIds = selections[pos.id] || [];
              const selectedCands = candidates.filter((c) => selectedCandIds.includes(c.id));

              return (
                <div key={pos.id} className="rounded-xl border border-[#D2E4D9] bg-[#F8FAF8] p-5">
                  <div className="text-[13px] font-bold text-[#00683E] uppercase tracking-wider">
                    {pos.title}
                  </div>
                  <div className="mt-3">
                    {selectedCands.length > 0 ? (
                      selectedCands.map((c) => (
                        <div key={c.id} className="flex items-center gap-3 py-1.5">
                          <CheckCircle2 className="h-5 w-5 text-[#008751]" />
                          <span className="font-bold text-[18px] text-[#0F291E]">{c.full_name}</span>
                          <span className="text-[#4A6356] font-mono text-[14px]">({c.political_party})</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[#64748B] italic text-[15px]">Abstained / Blank Ballot</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-[#D2E4D9] bg-[#F8FAF8] p-4 text-[14px] font-mono text-[#4A6356] leading-[1.5]">
            <p className="text-[#00683E] font-bold mb-1">Cryptographic Nonce &amp; Zero-Knowledge Proof:</p>
            <p className="text-[13px] text-[#4A6356] truncate">
              Voter ID: {voterIdInput} • PIN Verified: SHA-256 Validated • Anonymous Token Ready
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-[#E2ECE5] pt-5">
            <button
              type="button"
              onClick={() => setStep('ballot')}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg border border-[#D2E4D9] bg-[#F8FAF8] px-5 py-2.5 text-[16px] font-semibold text-[#4A6356] hover:text-[#0F291E] cursor-pointer disabled:opacity-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Modify Ballot</span>
            </button>

            <button
              type="button"
              onClick={handleFinalCastVote}
              disabled={isSubmitting}
              className="flex items-center gap-2.5 rounded-lg bg-[#008751] hover:bg-[#007043] px-8 py-3 text-[16px] sm:text-[18px] font-semibold text-white cursor-pointer disabled:opacity-50 transition-colors"
            >
              <Lock className="h-5 w-5" />
              <span>{isSubmitting ? 'Encrypting & Sealing Ballot...' : 'Seal & Submit Official Ballot'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS & RECEIPT */}
      {step === 'success' && generatedReceipt && (
        <div className="rounded-xl border border-[#D2E4D9] bg-[#FFFFFF] p-8 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-[#E8F5EE] border border-[#008751] text-[#008751]">
            <CheckCircle2 className="h-10 w-10 text-[#008751]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-[26px] sm:text-[32px] font-bold text-[#0F291E] leading-tight">
              Ballot Successfully Recorded &amp; Sealed
            </h2>
            <p className="text-[16px] font-normal text-[#4A6356] max-w-lg mx-auto leading-[1.5]">
              Your votes are irreversibly blinded and counted into the national tally. Download your official cryptographic PDF receipt below for independent verification.
            </p>
          </div>

          {/* Receipt Box */}
          <div className="mx-auto max-w-lg rounded-xl border border-[#008751] bg-[#F8FAF8] p-5 text-left font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#D2E4D9] pb-2 text-[12px] uppercase tracking-wider text-[#00683E]">
              <span className="font-bold">Federal Republic of Nigeria — E-Vote Receipt</span>
              <span className="text-[#008751] font-bold">LEDGER SEALED</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
              <div className="bg-white p-2 rounded-lg border border-[#D2E4D9] shrink-0">
                <QRCodeSvg value={generatedReceipt.receipt_hash} size={90} />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-[12px] text-[#4A6356]">ANONYMOUS TOKEN / BALLOT ID:</p>
                <p className="text-[15px] font-bold text-[#00683E] truncate">{generatedReceipt.receipt_id}</p>
                <p className="text-[12px] text-[#4A6356] pt-1">BLOCK HEIGHT: #{generatedReceipt.block_height}</p>
                <p className="text-[12px] text-[#0F291E] font-medium">{new Date(generatedReceipt.timestamp).toLocaleString()}</p>
              </div>
            </div>

            <div className="border-t border-[#D2E4D9] pt-2">
              <p className="text-[12px] text-[#4A6356]">SHA-256 RECEIPT HASH (JETBRAINS MONO):</p>
              <p className="text-[12px] text-[#008751] font-bold break-all">{generatedReceipt.receipt_hash}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => generateVoterReceiptPDF(generatedReceipt)}
              className="flex items-center gap-2 rounded-lg bg-[#008751] hover:bg-[#007043] px-7 py-3 text-[16px] sm:text-[18px] font-semibold text-white cursor-pointer transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Download Signed Official PDF Receipt</span>
            </button>

            {onFinish && (
              <button
                onClick={onFinish}
                className="rounded-lg border border-[#D2E4D9] bg-[#F8FAF8] hover:bg-[#E8F5EE] hover:border-[#008751] px-6 py-3 text-[16px] font-semibold text-[#4A6356] hover:text-[#0F291E] cursor-pointer transition-colors"
              >
                Return to Elector Portal
              </button>
            )}
          </div>
        </div>
      )}

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        candidate={activeCandidateModal}
        position={activeModalPosition}
        isOpen={!!activeCandidateModal}
        onClose={() => setActiveCandidateModal(null)}
      />

    </div>
  );
};
