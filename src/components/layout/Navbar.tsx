import React from 'react';
import {
  Vote,
  Building2,
  Search,
  LogOut,
  Menu,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useElection } from '../../context/ElectionContext';
import { NigeriaFlag } from '../common/NigeriaCrest';

interface NavbarProps {
  onOpenSidebar?: () => void;
  onOpenDocs?: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  currentPortal?: 'voter' | 'official' | 'audit';
  onSwitchPortal?: (portal: 'voter' | 'official' | 'audit') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSidebar,
  onOpenDocs,
  activeTab,
  setActiveTab,
  currentPortal = 'voter',
  onSwitchPortal,
}) => {
  const { currentUser, logout, switchUserRole } = useAuth();
  const { selectedElection } = useElection();

  const currentRole = currentUser?.role || (currentPortal === 'voter' ? 'voter' : 'admin');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E3E8E4] bg-white">
      {/* Top Flat Green Accent Line */}
      <div className="h-1 w-full bg-[#168447]" />

      <div className="h-16 sm:h-18 flex items-center justify-between px-4 sm:px-6 max-w-6xl mx-auto">
        
        {/* Left: Mobile Menu & Clean Branding */}
        <div className="flex items-center gap-3">
          {onOpenSidebar && currentUser && (
            <button
              type="button"
              onClick={onOpenSidebar}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-[#E3E8E4] bg-white text-[#202522] hover:bg-[#F6F7F6] cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <NigeriaFlag width={24} height={16} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-[#202522] tracking-tight">
                  E-Voting System
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F1F7F2] text-[#168447] border border-[#E3E8E4]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  School Project
                </span>
              </div>
              <p className="text-xs font-medium text-[#68716B] hidden sm:block">
                3 Portals: Voter • INEC • Audit
              </p>
            </div>
          </div>
        </div>

        {/* Center: Current Portal Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F1F7F2] border border-[#E3E8E4]">
          <span className="text-xs font-medium text-[#68716B]">Logged-in Portal:</span>
          <span className="text-xs font-bold text-[#168447] uppercase tracking-wide">
            {currentRole === 'admin' ? '🏛️ INEC Commission' : currentRole === 'auditor' ? '🔍 Audit & Observer' : '🗳️ Citizen Voter'}
          </span>
        </div>

        {/* Right: User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenDocs && (
            <button
              type="button"
              onClick={onOpenDocs}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E3E8E4] bg-white hover:bg-[#F6F7F6] text-xs sm:text-sm font-semibold text-[#202522] cursor-pointer transition-colors"
              title="Step-by-step documentation guide"
            >
              <BookOpen className="w-4 h-4 text-[#168447]" />
              <span>Project Guide</span>
            </button>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-bold text-[#202522] truncate max-w-[140px]">
                  {currentUser.full_name}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#168447]">
                  {currentUser.role === 'admin' ? 'INEC Official' : currentUser.role === 'auditor' ? 'Auditor' : 'Voter'}
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E3E8E4] bg-white hover:bg-rose-50 hover:border-rose-200 text-[#202522] hover:text-[#B42318] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                title="Log out or switch account"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : null}
        </div>

      </div>
    </header>
  );
};
