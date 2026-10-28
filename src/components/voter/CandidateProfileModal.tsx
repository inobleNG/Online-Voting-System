import React from 'react';
import { Award, CheckCircle2, FileText, UserCheck, X, ShieldCheck } from 'lucide-react';
import { Candidate, Position } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ManifestoViewer } from '../common/ManifestoViewer';
import { NigeriaFlag } from '../common/NigeriaCrest';

interface CandidateProfileModalProps {
  candidate: Candidate | null;
  position?: Position;
  isOpen: boolean;
  onClose: () => void;
  onSelectForBallot?: (candidateId: string) => void;
  isSelected?: boolean;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  candidate,
  position,
  isOpen,
  onClose,
  onSelectForBallot,
  isSelected = false,
}) => {
  if (!candidate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={candidate.full_name}
      subtitle={`Official Candidate for ${position?.title || 'Elected Office'} • Ballot #${candidate.ballot_number}`}
      maxWidth="3xl"
      icon={<Award className="h-5 w-5 text-[#008751]" />}
    >
      <div className="space-y-6 text-[#0F291E]">
        
        {/* Candidate Official Header Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-[#F8FAF8] border border-[#D2E4D9]">
          <img
            src={candidate.photo_url}
            alt={candidate.full_name}
            className="h-24 w-24 rounded-lg object-cover border border-[#008751] shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <span className="font-bold text-[20px] text-[#0F291E]">
                {candidate.full_name}
              </span>
              <NigeriaFlag width={20} height={14} />
              <Badge variant={candidate.status === 'active' ? 'success' : 'danger'} size="sm">
                {candidate.status.toUpperCase()}
              </Badge>
            </div>

            <p className="text-[14px] font-semibold text-[#00683E] tracking-wide">
              {candidate.political_party} {candidate.political_party_acronym ? `(${candidate.political_party_acronym})` : ''}
            </p>

            {candidate.running_mate && (
              <p className="text-[14px] text-[#4A6356] leading-[1.5]">
                Nominated Running Mate: <strong className="text-[#0F291E]">{candidate.running_mate}</strong>
              </p>
            )}

            {candidate.state_of_origin && (
              <p className="text-[14px] text-[#4A6356] font-mono leading-[1.5]">
                State of Origin: <span className="text-[#0F291E] font-bold">{candidate.state_of_origin}</span>
              </p>
            )}

            <p className="text-[14px] italic text-[#008751] pt-1 font-medium leading-[1.5]">
              "{candidate.motto}"
            </p>
          </div>
        </div>

        {/* Rich Policy & PDF Manifesto Viewer */}
        <div>
          <h4 className="text-[14px] font-bold text-[#00683E] uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#008751]" />
            <span>OFFICIAL CAMPAIGN MANIFESTO &amp; GOVERNANCE COMPACT</span>
          </h4>
          <ManifestoViewer
            candidate={candidate}
            position={position}
            allowUpload={false}
          />
        </div>

        {/* Action Button for Voting Booth */}
        {onSelectForBallot && (
          <div className="flex justify-end pt-4 border-t border-[#D2E4D9]">
            <button
              onClick={() => {
                onSelectForBallot(candidate.id);
                onClose();
              }}
              className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-[16px] font-semibold transition-colors cursor-pointer ${
                isSelected
                  ? 'border-2 border-[#008751] bg-[#E8F5EE] text-[#00683E] font-bold'
                  : 'bg-[#008751] hover:bg-[#007043] text-white'
              }`}
            >
              {isSelected ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Selected on Ballot</span>
                </>
              ) : (
                <span>Confirm &amp; Select for Ballot</span>
              )}
            </button>
          </div>
        )}

      </div>
    </Modal>
  );
};

