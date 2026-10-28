import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Database,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  Lock,
  Server,
  UserCheck,
  Save,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useElection } from '../../context/ElectionContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Badge } from '../common/Badge';

export const SystemSettings: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { resetToInitialDemoData, addAuditLog } = useElection();

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [twoFactor, setTwoFactor] = useState(currentUser?.two_factor_enabled || false);

  const [rateLimitingActive, setRateLimitingActive] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30);
  const [requireBiometricSimulator, setRequireBiometricSimulator] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      email,
      department,
      two_factor_enabled: twoFactor,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    addAuditLog('SETTINGS_UPDATED', 'SECURITY', `Updated security profile for ${email}`, 'info');
  };

  const handleResetData = () => {
    if (confirm('Reset system to pristine certified demo database state? All votes, elections, and receipts will return to factory default.')) {
      resetToInitialDemoData();
      alert('System successfully reset to default certified demo dataset.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-slate-900">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            CONFIGURATION &amp; NATIONAL SECURITY
          </span>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mt-1">
          System Administration &amp; Security Settings
        </h2>
        <p className="text-xs text-slate-500">
          Configure cryptographic policies, database sync status, multi-factor authentication, and officer account profile
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs font-mono text-[#008751] border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-[#008751] shrink-0" />
          <span>Security preferences updated successfully on institutional server.</span>
        </div>
      )}

      {/* Cloud & PostgreSQL Integration Status */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                PostgreSQL &amp; Cloud Ledger Infrastructure
              </h3>
              <p className="text-[11px] text-slate-500">
                Database layer with Row Level Security &amp; Atomic Stored Procedures
              </p>
            </div>
          </div>
          <Badge variant={isSupabaseConfigured ? 'success' : 'blue'} size="sm">
            {isSupabaseConfigured ? 'Live Cloud Connected' : 'High-Performance Local Ledger'}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
            <span className="font-semibold text-slate-800 block mb-1">
              Storage Engine:
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Active with durable local storage + optional Supabase live cloud synchronization. Fully self-contained.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
            <span className="font-semibold text-slate-800 block mb-1">
              Security Protocol Level:
            </span>
            <p className="text-[11px] text-[#008751] font-mono leading-relaxed">
              AES-256-GCM / SHA-256 Merkle Verification Active
            </p>
          </div>
        </div>
      </div>

      {/* Profile & 2FA Settings */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-slate-500" />
          <span>Electoral Officer Profile &amp; Authentication</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#008751] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#008751] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Institutional Department / Office
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#008751] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3.5">
            <div>
              <span className="text-xs font-semibold text-slate-900 block">
                Two-Factor Authentication (2FA / OTP)
              </span>
              <span className="text-[11px] text-slate-500">
                Require 6-digit one-time passcode on login
              </span>
            </div>
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={(e) => setTwoFactor(e.target.checked)}
              className="h-4 w-4 rounded accent-[#008751] cursor-pointer"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-[#008751] hover:bg-[#007043] px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dangerous Operations */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-rose-700 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>Reset to Pristine Demo Dataset</span>
            </h4>
            <p className="text-xs text-rose-600/90 mt-0.5 max-w-lg">
              Re-initializes default elections, candidate slates, voter rolls, and verifiable genesis blocks.
            </p>
          </div>
          <button
            onClick={handleResetData}
            className="rounded-lg border border-rose-300 bg-white hover:bg-rose-100/60 px-4 py-2 text-xs font-semibold font-mono text-rose-700 transition-colors cursor-pointer shrink-0"
          >
            Reset Database
          </button>
        </div>
      </div>

    </div>
  );
};
