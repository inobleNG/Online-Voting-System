import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  BookOpen,
  Vote,
  Building2,
  MapPin,
  Users,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenManual?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onOpenManual }) => {
  const { login, availableUsers, switchUserById } = useAuth();
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<'all' | 'voter' | 'admin' | 'rec' | 'spo' | 'auditor'>('all');
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError(null);
    setLoading(true);

    if (isForgot) {
      setTimeout(() => {
        setLoading(false);
        setForgotSuccess(true);
      }, 700);
      return;
    }

    const res = await login(email, password, rememberMe);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = (u: any) => {
    switchUserById(u.id);
    onClose();
  };

  const filteredUsers = availableUsers.filter((u) => {
    if (selectedRoleCategory === 'all') return true;
    if (selectedRoleCategory === 'admin') return u.role === 'admin';
    if (selectedRoleCategory === 'rec') return u.role === 'rec' || u.role === 'officer';
    if (selectedRoleCategory === 'spo') return u.role === 'spo';
    if (selectedRoleCategory === 'auditor') return u.role === 'auditor';
    if (selectedRoleCategory === 'voter') return u.role === 'voter';
    return true;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isForgot
          ? 'Reset Security Passkey'
          : 'National Electoral Portal Access'
      }
      subtitle={
        isForgot
          ? 'Enter your institutional email to receive an official recovery token'
          : 'Role-Based Authentication: Elector, CEC (HQ), REC, SPO & Auditor'
      }
      maxWidth="lg"
      icon={<ShieldCheck className="h-5 w-5 text-[#008751]" />}
    >
      {forgotSuccess ? (
        <div className="py-6 text-center text-slate-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-[#008751]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="mt-3 text-base font-semibold text-slate-900">
            Official Recovery Dispatched
          </h4>
          <p className="mt-1 text-xs text-slate-600 max-w-xs mx-auto">
            A password reset token with one-time verification link has been dispatched to{' '}
            <strong className="text-[#008751] font-mono">{email}</strong>.
          </p>
          <button
            onClick={() => {
              setIsForgot(false);
              setForgotSuccess(false);
            }}
            className="mt-6 w-full rounded-lg bg-[#008751] hover:bg-[#007043] py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Return to Portal Login
          </button>
        </div>
      ) : (
        <div className="space-y-4 text-slate-900">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Quick Filter Tabs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Persona Filter:
              </span>
              {onOpenManual && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenManual();
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#008751] hover:underline cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Step-by-Step Manuals</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'voter', label: '1. Citizen Voter' },
                { id: 'admin', label: '2. INEC Commission' },
                { id: 'auditor', label: '3. Auditor' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedRoleCategory(cat.id as any)}
                  className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold text-center transition-colors cursor-pointer ${
                    selectedRoleCategory === cat.id
                      ? 'border-[#008751] bg-[#008751] text-white shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Persona Quick Access */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#008751]" />
              <span>1-CLICK VERIFIED LOGIN PERSONAS:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 hover:border-[#008751] p-2.5 text-left transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <img
                    src={u.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                    alt=""
                    className="w-8 h-8 rounded-md object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs text-slate-900 truncate">{u.full_name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-[#008751] font-mono font-bold truncate">
                        {u.role === 'admin'
                          ? 'INEC Official'
                          : u.role === 'auditor'
                          ? 'Auditor'
                          : 'Citizen Voter'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium truncate">
                        {u.state || 'National'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Official Email / VIN Identifier
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="official@elections.gov.ng"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#008751] focus:outline-none font-mono transition-colors"
                />
              </div>
            </div>

            {!isForgot && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Confidential Passkey / PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgot(true)}
                    className="text-[11px] text-[#008751] hover:underline font-medium cursor-pointer"
                  >
                    Forgot passkey?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {!isForgot && (
              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer font-normal">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded accent-[#008751]"
                  />
                  <span>Maintain accredited session</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#008751] hover:bg-[#007043] py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              <span>
                {loading
                  ? 'Verifying Credentials...'
                  : isForgot
                  ? 'Send Official Token'
                  : 'Accredit & Sign In'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </Modal>
  );
};
