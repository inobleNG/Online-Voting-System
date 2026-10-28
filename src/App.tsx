import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ElectionProvider, useElection } from './context/ElectionContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AuthModal } from './components/auth/AuthModal';
import { TwoFactorModal } from './components/auth/TwoFactorModal';

// Admin / INEC Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CandidateManager } from './components/admin/CandidateManager';
import { VoterRollManager } from './components/admin/VoterRollManager';
import { AuditLogViewer } from './components/admin/AuditLogViewer';

// Voter Views
import { VoterDashboard } from './components/voter/VoterDashboard';
import { VotingBooth } from './components/voter/VotingBooth';
import { VerifyReceiptPortal } from './components/voter/VerifyReceiptPortal';
import { VoterPortalLogin } from './components/voter/VoterPortalLogin';

// Results
import { ResultsAnalytics } from './components/results/ResultsAnalytics';

// Common
import { RoleDocumentationModal } from './components/common/RoleDocumentationModal';
import { GraduationCap, Vote, Building2, Search, ArrowRight } from 'lucide-react';
import { NigeriaFlag } from './components/common/NigeriaCrest';

const AppContent: React.FC = () => {
  const { currentUser, is2faModalOpen, setIs2faModalOpen, pending2faUser, verify2faCode, switchUserRole } = useAuth();
  const { setSelectedElectionId } = useElection();

  // Portal & Tab State
  const [currentPortal, setCurrentPortal] = useState<'voter' | 'official' | 'audit'>('voter');
  const [activeTab, setActiveTab] = useState<string>('voter-home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('audit')) {
        setCurrentPortal('audit');
        switchUserRole('auditor');
        setActiveTab('audit');
      } else if (hash.includes('inec') || hash.includes('admin') || hash.includes('official')) {
        setCurrentPortal('official');
        switchUserRole('admin');
        setActiveTab('dashboard');
      } else if (hash.includes('voter') || hash.includes('booth')) {
        setCurrentPortal('voter');
        switchUserRole('voter');
        setActiveTab('voting-booth');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle switching portals
  const handleSwitchPortal = (portal: 'voter' | 'official' | 'audit') => {
    setCurrentPortal(portal);
    if (portal === 'voter') {
      switchUserRole('voter');
      setActiveTab('voting-booth');
      window.location.hash = 'voter';
    } else if (portal === 'official') {
      switchUserRole('admin');
      setActiveTab('dashboard');
      window.location.hash = 'inec';
    } else if (portal === 'audit') {
      switchUserRole('auditor');
      setActiveTab('audit');
      window.location.hash = 'audit';
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleEnterVotingBooth = (electionId: string) => {
    setSelectedElectionId(electionId);
    setActiveTab('voting-booth');
  };

  const handleViewResults = (electionId: string) => {
    setSelectedElectionId(electionId);
    setActiveTab('results');
  };

  const handleVerifyReceipt = () => {
    setActiveTab('verify-receipt');
  };

  // If user is not authenticated, show simplified Login screen
  const isUnauthenticated = !currentUser;

  return (
    <div className="flex min-h-screen bg-white text-[#202522] font-sans antialiased">
      
      {/* Responsive Collapsible Sidebar */}
      {!isUnauthenticated && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          currentPortal={currentPortal}
          onSwitchPortal={handleSwitchPortal}
          onOpenManual={() => setDocsModalOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white">
        
        {/* Top Navbar */}
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenDocs={() => setDocsModalOpen(true)}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          currentPortal={currentPortal}
          onSwitchPortal={handleSwitchPortal}
        />

        {/* Dynamic Main Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F6F7F6]">
          <div className="mx-auto max-w-5xl">
            
            {/* If unauthenticated, show the simplified 3-tab login */}
            {isUnauthenticated ? (
              <VoterPortalLogin
                onSuccessLogin={() => {
                  setActiveTab('voting-booth');
                }}
                onSwitchToOfficial={() => handleSwitchPortal('official')}
                onLoginRole={(role, targetTab) => {
                  if (role === 'voter') {
                    setCurrentPortal('voter');
                    setActiveTab(targetTab || 'voting-booth');
                  } else if (role === 'admin') {
                    setCurrentPortal('official');
                    setActiveTab(targetTab || 'dashboard');
                  } else if (role === 'auditor') {
                    setCurrentPortal('audit');
                    setActiveTab(targetTab || 'audit');
                  }
                }}
              />
            ) : (
              <>
                {/* 1. VOTER VIEWS */}
                {activeTab === 'voting-booth' && (
                  <VotingBooth onFinish={() => setActiveTab('verify-receipt')} />
                )}

                {activeTab === 'voter-home' && (
                  <VoterDashboard
                    onEnterVotingBooth={handleEnterVotingBooth}
                    onViewResults={handleViewResults}
                    onVerifyReceipt={handleVerifyReceipt}
                  />
                )}

                {activeTab === 'verify-receipt' && <VerifyReceiptPortal />}

                {/* 2. INEC / ADMIN VIEWS */}
                {activeTab === 'dashboard' && (
                  <AdminDashboard
                    onNavigateToElections={() => setActiveTab('candidates')}
                    onNavigateToVoters={() => setActiveTab('voters')}
                    onNavigateToAudit={() => setActiveTab('audit')}
                    onNavigateToResults={() => setActiveTab('results')}
                    setActiveTab={setActiveTab}
                  />
                )}

                {activeTab === 'candidates' && <CandidateManager />}

                {activeTab === 'voters' && <VoterRollManager />}

                {/* 3. AUDIT VIEWS */}
                {activeTab === 'audit' && <AuditLogViewer />}

                {/* 4. SHARED RESULTS VIEW */}
                {activeTab === 'results' && <ResultsAnalytics />}
              </>
            )}

          </div>
        </main>

        {/* Clean Footer with Flat Green Style */}
        <footer className="border-t border-[#E3E8E4] bg-white py-3.5 px-4 text-center text-xs text-[#68716B]">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-bold text-[#202522]">E-Voting System Project</span>
            <span className="text-[#E3E8E4]">•</span>
            <span>Voter • INEC • Audit</span>
            <span className="text-[#E3E8E4]">•</span>
            <span className="text-[#168447] font-bold">Cryptographically Verifiable</span>
          </div>
        </footer>

      </div>

      {/* Auth Modal if needed */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onOpenManual={() => setDocsModalOpen(true)}
      />

      {/* 2FA Verification Modal */}
      <TwoFactorModal
        isOpen={is2faModalOpen}
        onClose={() => setIs2faModalOpen(false)}
        onVerify={verify2faCode}
        userEmail={pending2faUser?.email || ''}
      />

      {/* Role Documentation Modal */}
      <RoleDocumentationModal
        isOpen={docsModalOpen}
        onClose={() => setDocsModalOpen(false)}
        initialRole={currentUser?.role || 'voter'}
        onSelectAction={handleTabChange}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ElectionProvider>
        <AppContent />
      </ElectionProvider>
    </AuthProvider>
  );
}
