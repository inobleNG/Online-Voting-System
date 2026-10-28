import React from 'react';
import { NigeriaCrest, NigeriaFlag } from '../common/NigeriaCrest';

interface FooterProps {
  onNavigate?: (tab: string) => void;
  onOpenDocs?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDocs }) => {
  return (
    <footer className="bg-[#151916] text-[#A6B2A8] text-xs pt-12 pb-8 border-t border-[#232924]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top 3-Column Area (matching EFCC screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#232924]">
          
          {/* Left Column: Brand, Mission & Contact */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <NigeriaCrest size="sm" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-black text-base tracking-tight">INEC</span>
                  <NigeriaFlag width={18} height={12} />
                </div>
                <p className="text-[11px] text-[#A6B2A8]">
                  Independent National Electoral Commission
                </p>
              </div>
            </div>

            <p className="text-[#849286] text-xs leading-relaxed max-w-md pt-1">
              The official electronic voting portal of the Independent National Electoral Commission. The balloting process is cryptographically verifiable, confidential, and completely free of charge. INEC does not authorize any agent to collect fees from electors.
            </p>

            <div className="pt-2 text-xs text-[#849286]">
              Need help? Email <a href="mailto:contact@inecnigeria.org" className="text-white hover:underline">contact@inecnigeria.org</a>
            </div>
          </div>

          {/* Center Column: Portals & Ballots */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Portals &amp; Balloting
            </h4>
            <ul className="space-y-2 text-[#849286]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('candidates')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contested Offices
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('voter-home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Voter Accreditation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('voting-booth')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cast Secret Ballot
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('results')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Live Collation &amp; Results
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('verify-receipt')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Verify Ballot Receipt
                </button>
              </li>
            </ul>
          </div>

          {/* Right Column: Account & Governance */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Account &amp; Access
            </h4>
            <ul className="space-y-2 text-[#849286]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('voter-home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Citizen Sign In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('dashboard')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  INEC Staff Portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('audit')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Independent Audit
                </button>
              </li>
              {onOpenDocs && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenDocs}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Documentation &amp; Manual
                  </button>
                </li>
              )}
              <li className="text-[#647466] pt-1">
                Electoral Act 2026 Compliant
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Area with subtle dot */}
        <div className="pt-6 text-center text-[11px] text-[#647466] space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#168447]" />
            <span>End-to-End Cryptographically Verifiable (E2E-V) Architecture</span>
          </div>
          <p>
            Copyright &copy; 2026 INEC | All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
