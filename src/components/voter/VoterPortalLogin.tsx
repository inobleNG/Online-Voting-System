import React, { useState } from 'react';
import {
  Vote,
  KeyRound,
  Building2,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useElection } from '../../context/ElectionContext';
import { UserRole } from '../../types';

interface VoterPortalLoginProps {
  onSuccessLogin: () => void;
  onSwitchToOfficial?: () => void;
  onLoginRole?: (role: UserRole, targetTab: string) => void;
}

export const VoterPortalLogin: React.FC<VoterPortalLoginProps> = ({
  onSuccessLogin,
  onLoginRole,
}) => {
  const { loginWithVoterIdAndPin, login, availableUsers, switchUserById } = useAuth();
  const { voterRoll } = useElection();

  // Exactly 3 roles for school project
  const [activeTab, setActiveTab] = useState<'voter' | 'inec' | 'audit'>('voter');

  // Voter credentials
  const [voterId, setVoterId] = useState('90F5 B028 1429 8812 041');
  const [voterPin, setVoterPin] = useState('884129');

  // INEC credentials
  const [inecEmail, setInecEmail] = useState('cec.hq@elections.gov.ng');
  const [inecPassword, setInecPassword] = useState('admin123');

  // Audit credentials
  const [auditEmail, setAuditEmail] = useState('auditor@civic-watch.ng');
  const [auditPassword, setAuditPassword] = useState('audit123');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fast presets for demonstration
  const demoVoter = voterRoll[0] || {
    full_name: 'Hajiya Amina Bello',
    voter_id: 'VTR-2026-8841',
    vin_number: '90F5 B028 1429 8812 041',
    verification_pin: '884129',
  };

  const demoInecUser = availableUsers.find((u) => u.role === 'admin') || availableUsers[0];
  const demoAuditorUser = availableUsers.find((u) => u.role === 'auditor') || availableUsers[0];

  const handleVoterLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const ok = loginWithVoterIdAndPin(voterId.trim(), voterPin.trim());
      setIsLoading(false);
      if (ok) {
        if (onLoginRole) onLoginRole('voter', 'voter-home');
        else onSuccessLogin();
      } else {
        setErrorMessage('Invalid Voter ID/VIN or PIN. Click the Quick Demo button for instant access.');
      }
    }, 300);
  };

  const handleInecLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const res = await login(inecEmail, inecPassword);
    setIsLoading(false);
    if (res.success) {
      if (onLoginRole) onLoginRole('admin', 'dashboard');
      else onSuccessLogin();
    } else {
      setErrorMessage('Login failed. Click the Quick Demo button for instant access.');
    }
  };

  const handleAuditLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const res = await login(auditEmail, auditPassword);
    setIsLoading(false);
    if (res.success) {
      if (onLoginRole) onLoginRole('auditor', 'audit');
      else onSuccessLogin();
    } else {
      setErrorMessage('Login failed. Click the Quick Demo button for instant access.');
    }
  };

  // Instant demo handlers
  const handleQuickDemoVoter = () => {
    loginWithVoterIdAndPin(demoVoter.vin_number || demoVoter.voter_id, demoVoter.verification_pin || '884129');
    if (onLoginRole) onLoginRole('voter', 'voter-home');
    else onSuccessLogin();
  };

  const handleQuickDemoInec = () => {
    if (demoInecUser) switchUserById(demoInecUser.id);
    if (onLoginRole) onLoginRole('admin', 'dashboard');
    else onSuccessLogin();
  };

  const handleQuickDemoAudit = () => {
    if (demoAuditorUser) switchUserById(demoAuditorUser.id);
    if (onLoginRole) onLoginRole('auditor', 'audit');
    else onSuccessLogin();
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-2 sm:px-4">
      
      {/* Main Login Card - Exact arrangement from previous dashboard, styled in flat green */}
      <div className="bg-white border border-[#E3E8E4] rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header */}
        <div className="text-center pt-8 pb-6 px-6 border-b border-[#E3E8E4]">
          <h1 className="text-2xl sm:text-3xl font-black text-[#202522] tracking-tight">
            E-Voting Demonstration Portal
          </h1>
          <p className="text-sm sm:text-base text-[#68716B] mt-1">
            Choose a role below to log in and test the system
          </p>
        </div>

        {/* 3 Large Role Tabs */}
        <div className="grid grid-cols-3 p-2 bg-[#F6F7F6] gap-1.5 border-b border-[#E3E8E4]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('voter');
              setErrorMessage(null);
            }}
            className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl text-center font-bold text-sm sm:text-base transition-colors cursor-pointer ${
              activeTab === 'voter'
                ? 'bg-white text-[#168447] shadow-xs border border-[#E3E8E4]'
                : 'text-[#68716B] hover:text-[#202522]'
            }`}
          >
            <Vote className="w-5 h-5 mb-1 text-[#168447]" />
            <span>1. Voter</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('inec');
              setErrorMessage(null);
            }}
            className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl text-center font-bold text-sm sm:text-base transition-colors cursor-pointer ${
              activeTab === 'inec'
                ? 'bg-white text-[#168447] shadow-xs border border-[#E3E8E4]'
                : 'text-[#68716B] hover:text-[#202522]'
            }`}
          >
            <Building2 className="w-5 h-5 mb-1 text-[#168447]" />
            <span>2. INEC</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('audit');
              setErrorMessage(null);
            }}
            className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl text-center font-bold text-sm sm:text-base transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-white text-[#168447] shadow-xs border border-[#E3E8E4]'
                : 'text-[#68716B] hover:text-[#202522]'
            }`}
          >
            <Search className="w-5 h-5 mb-1 text-[#168447]" />
            <span>3. Audit</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-6 sm:p-8">
          
          {/* TAB 1: CITIZEN VOTER */}
          {activeTab === 'voter' && (
            <div className="space-y-6">
              {/* One-Click Demo Button */}
              <button
                type="button"
                onClick={handleQuickDemoVoter}
                className="w-full py-4 px-5 rounded-xl bg-[#168447] hover:bg-[#116B39] text-white text-base sm:text-lg font-bold flex items-center justify-center gap-3 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>👉 Quick Demo Login as Voter ({demoVoter.full_name})</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#E3E8E4] w-full" />
                <span className="bg-white px-3 text-xs font-semibold text-[#68716B] uppercase tracking-wider absolute">
                  or enter voter details
                </span>
              </div>

              <form onSubmit={handleVoterLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#202522] mb-1.5">
                    Voter ID Number (VIN)
                  </label>
                  <input
                    type="text"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    placeholder="e.g. 90F5 B028 1429 8812 041"
                    className="w-full px-4 py-3 rounded-xl border border-[#E3E8E4] text-base font-mono text-[#202522] focus:border-[#168447] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#202522] mb-1.5">
                    6-Digit Voting PIN
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={voterPin}
                    onChange={(e) => setVoterPin(e.target.value)}
                    placeholder="6-digit PIN (demo: 884129)"
                    className="w-full px-4 py-3 rounded-xl border border-[#E3E8E4] text-base font-mono text-[#202522] focus:border-[#168447] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-[#168447] text-[#168447] hover:bg-[#F1F7F2] text-base font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Vote className="w-5 h-5" />
                  <span>{isLoading ? 'Verifying...' : 'Sign In as Voter'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: INEC PORTAL */}
          {activeTab === 'inec' && (
            <div className="space-y-6">
              {/* One-Click Demo Button */}
              <button
                type="button"
                onClick={handleQuickDemoInec}
                className="w-full py-4 px-5 rounded-xl bg-[#168447] hover:bg-[#116B39] text-white text-base sm:text-lg font-bold flex items-center justify-center gap-3 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>👉 Quick Demo Login as INEC Administrator</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#E3E8E4] w-full" />
                <span className="bg-white px-3 text-xs font-semibold text-[#68716B] uppercase tracking-wider absolute">
                  or enter staff credentials
                </span>
              </div>

              <form onSubmit={handleInecLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#202522] mb-1.5">
                    INEC Officer Email
                  </label>
                  <input
                    type="email"
                    value={inecEmail}
                    onChange={(e) => setInecEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E3E8E4] text-base text-[#202522] focus:border-[#168447] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#202522] mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={inecPassword}
                    onChange={(e) => setInecPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E3E8E4] text-base text-[#202522] focus:border-[#168447] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-[#168447] text-[#168447] hover:bg-[#F1F7F2] text-base font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Building2 className="w-5 h-5" />
                  <span>{isLoading ? 'Authenticating...' : 'Sign In as INEC'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: AUDIT PORTAL */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              {/* One-Click Demo Button */}
              <button
                type="button"
                onClick={handleQuickDemoAudit}
                className="w-full py-4 px-5 rounded-xl bg-[#168447] hover:bg-[#116B39] text-white text-base sm:text-lg font-bold flex items-center justify-center gap-3 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>👉 Quick Demo Login as Independent Auditor</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#E3E8E4] w-full" />
                <span className="bg-white px-3 text-xs font-semibold text-[#68716B] uppercase tracking-wider absolute">
                  or enter auditor credentials
                </span>
              </div>

              <form onSubmit={handleAuditLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#202522] mb-1.5">
                    Auditor Email / ID
                  </label>
                  <input
                    type="email"
                    value={auditEmail}
                    onChange={(e) => setAuditEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E3E8E4] text-base text-[#202522] focus:border-[#168447] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#202522] mb-1.5">
                    Audit Access Key
                  </label>
                  <input
                    type="password"
                    value={auditPassword}
                    onChange={(e) => setAuditPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E3E8E4] text-base text-[#202522] focus:border-[#168447] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-[#168447] text-[#168447] hover:bg-[#F1F7F2] text-base font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                  <span>{isLoading ? 'Authenticating...' : 'Sign In as Auditor'}</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* School Project 3-Step Flow Summary (Matching exact bottom arrangement in screenshot) */}
        <div className="bg-[#F6F7F6] border-t border-[#E3E8E4] p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#68716B] mb-3 text-center">
            How This School Project Works
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="bg-white p-3.5 rounded-xl border border-[#E3E8E4]">
              <div className="font-bold text-[#202522] text-sm flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#F1F7F2] text-[#168447] flex items-center justify-center text-xs font-bold border border-[#E3E8E4]">1</span>
                Voter
              </div>
              <p className="text-xs text-[#68716B] mt-1">
                Logs in, selects candidate, casts encrypted ballot, and receives a receipt hash.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E3E8E4]">
              <div className="font-bold text-[#202522] text-sm flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#F1F7F2] text-[#168447] flex items-center justify-center text-xs font-bold border border-[#E3E8E4]">2</span>
                INEC
              </div>
              <p className="text-xs text-[#68716B] mt-1">
                Manages candidates and voter lists, and monitors live verified vote tallies.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E3E8E4]">
              <div className="font-bold text-[#202522] text-sm flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#F1F7F2] text-[#168447] flex items-center justify-center text-xs font-bold border border-[#E3E8E4]">3</span>
                Audit
              </div>
              <p className="text-xs text-[#68716B] mt-1">
                Verifies SHA-256 cryptographic chain integrity and checks ballot receipts.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
