import React from 'react';
import {
  Vote,
  Users,
  Award,
  BarChart3,
  ShieldCheck,
  Search,
  Building2,
  FileCheck2,
  QrCode,
  X,
  BookOpen,
  GraduationCap,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NigeriaFlag } from '../common/NigeriaCrest';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  currentPortal?: 'voter' | 'official' | 'audit';
  onSwitchPortal?: (portal: 'voter' | 'official' | 'audit') => void;
  onOpenManual?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  onOpenManual,
}) => {
  const { currentUser, switchUserRole } = useAuth();

  const userRole = currentUser?.role || 'voter';

  // 1. Voter Navigation: Cast Vote, My Details, Verify Receipt, Results
  const voterNav: NavItem[] = [
    { id: 'voting-booth', label: 'Cast Vote (Voting Booth)', icon: Vote, highlight: true },
    { id: 'voter-home', label: 'My Voter Profile', icon: FileCheck2 },
    { id: 'verify-receipt', label: 'Verify Vote Receipt', icon: QrCode },
    { id: 'results', label: 'Live Results', icon: BarChart3 },
  ];

  // 2. INEC Navigation: Dashboard, Candidates, Voter Register, Results, Admin Settings
  const inecNav: NavItem[] = [
    { id: 'dashboard', label: 'INEC Dashboard', icon: Building2 },
    { id: 'candidates', label: 'Contesting Candidates', icon: Award },
    { id: 'voters', label: 'Registered Voters List', icon: Users },
    { id: 'results', label: 'Live Results', icon: BarChart3 },
    { id: 'settings', label: 'Admin Settings & System', icon: Settings },
  ];

  // 3. Audit Navigation: Audit Ledger, Receipt Validator, Results
  const auditNav: NavItem[] = [
    { id: 'audit', label: 'Cryptographic Audit Ledger', icon: Search },
    { id: 'verify-receipt', label: 'Verify Ballot Receipt', icon: QrCode },
    { id: 'results', label: 'Certified Results', icon: BarChart3 },
  ];

  const navItems =
    userRole === 'admin'
      ? inecNav
      : userRole === 'auditor'
      ? auditNav
      : voterNav;

  const currentRoleTitle =
    userRole === 'admin'
      ? 'INEC Portal'
      : userRole === 'auditor'
      ? 'Audit Portal'
      : 'Voter Portal';

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 bg-white border-r border-[#E3E8E4]">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E3E8E4]">
          <div className="flex items-center gap-2.5">
            <NigeriaFlag width={22} height={14} />
            <div>
              <div className="text-sm font-black text-[#202522] uppercase tracking-tight">
                {currentRoleTitle}
              </div>
              <div className="text-xs font-semibold text-[#168447]">
                Official Roster
              </div>
            </div>
          </div>
          {setIsOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-md text-[#68716B] hover:bg-[#F6F7F6]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Clean Flat Navigation Buttons */}
        <nav className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#68716B] px-3 mb-2">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setIsOpen) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-bold transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#168447] text-white shadow-xs'
                    : item.highlight
                    ? 'bg-[#F1F7F2] text-[#168447] hover:bg-[#E7F3EB] border border-[#E3E8E4]'
                    : 'text-[#202522] hover:bg-[#F6F7F6]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-[#168447]' : 'text-[#68716B]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="pt-4 border-t border-[#E3E8E4] space-y-3">
        {onOpenManual && (
          <button
            onClick={onOpenManual}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#E3E8E4] bg-white hover:bg-[#F6F7F6] text-xs font-bold text-[#202522] transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#168447]" />
            <span>Official System Manual</span>
          </button>
        )}
        <div className="bg-[#F1F7F2] rounded-lg p-3 border border-[#E3E8E4] text-xs text-[#202522]">
          <div className="font-bold flex items-center gap-1.5 text-[#168447]">
            <GraduationCap className="w-4 h-4" />
            <span>Electoral Act 2026</span>
          </div>
          <p className="text-[11px] text-[#68716B] mt-1 leading-relaxed">
            End-to-End Cryptographically Verifiable (E2E-V) electronic voting and collation.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 overflow-y-auto z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen && setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full bg-white shadow-xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
