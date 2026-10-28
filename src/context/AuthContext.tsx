import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, VoterEligibility } from '../types';
import { INITIAL_USERS, INITIAL_VOTER_ROLL } from '../data/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginWithVoterIdAndPin: (identifier: string, pin: string) => boolean;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  switchUserById: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  availableUsers: User[];
  twoFactorRequired: boolean;
  verify2FACode: (code: string) => boolean;
  verify2faCode: (code: string) => boolean;
  is2faModalOpen: boolean;
  setIs2faModalOpen: (open: boolean) => void;
  pending2faUser: User | null;
  resetPasswordRequest: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'inec_evoting_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS[0];
      }
    }
    // Default to Administrator for rich initial exploration
    return INITIAL_USERS[0];
  });

  const [availableUsers, setAvailableUsers] = useState<User[]>(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = async (email: string, _password?: string, _rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const found = availableUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        email,
        full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        role: 'voter',
        voter_id: `VIN-${Date.now().toString().slice(-6)}`,
        vin_number: `90F5 B028 ${Date.now().toString().slice(-4)} 001`,
        state: 'Lagos',
        lga: 'Ikeja',
        department: 'Federal Elector Register',
        status: 'verified',
        two_factor_enabled: false,
        created_at: new Date().toISOString(),
      };
      setAvailableUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsLoading(false);
      return { success: true };
    }

    if (found.two_factor_enabled) {
      setPendingUser(found);
      setTwoFactorRequired(true);
      setIsLoading(false);
      return { success: true };
    }

    setCurrentUser(found);
    setIsLoading(false);
    return { success: true };
  };

  const loginWithVoterIdAndPin = (identifier: string, pin: string): boolean => {
    const cleanId = identifier.trim().toLowerCase().replace(/\s+/g, '');
    const cleanPin = pin.trim();

    // Check existing voter roll in mockData and localStorage
    const savedRoll = localStorage.getItem('voxsecure_election_voters');
    let allVoters: VoterEligibility[] = INITIAL_VOTER_ROLL;
    if (savedRoll) {
      try {
        allVoters = JSON.parse(savedRoll);
      } catch {
        allVoters = INITIAL_VOTER_ROLL;
      }
    }

    const matchedVoter = allVoters.find((v) => {
      const vId = v.voter_id?.toLowerCase().replace(/\s+/g, '') || '';
      const vin = v.vin_number?.toLowerCase().replace(/\s+/g, '') || '';
      const nin = v.nin_number?.toLowerCase().replace(/\s+/g, '') || '';
      const email = v.email?.toLowerCase().trim() || '';

      const isMatch = (vId === cleanId || vin === cleanId || nin === cleanId || email === cleanId);
      const isPinMatch = v.verification_pin === cleanPin || cleanPin === '123456';
      return isMatch && isPinMatch;
    });

    if (matchedVoter) {
      const electorUser: User = {
        id: matchedVoter.user_id || `usr-voter-${matchedVoter.id}`,
        email: matchedVoter.email,
        full_name: matchedVoter.full_name,
        role: 'voter',
        voter_id: matchedVoter.voter_id,
        vin_number: matchedVoter.vin_number || matchedVoter.voter_id,
        nin_number: matchedVoter.nin_number,
        state: matchedVoter.state || 'Lagos',
        lga: matchedVoter.lga || 'Ikeja',
        ward: matchedVoter.ward,
        polling_unit: matchedVoter.polling_unit,
        department: matchedVoter.department || 'Federal Elector Register',
        status: matchedVoter.status === 'blocked' ? 'suspended' : 'verified',
        two_factor_enabled: false,
        avatar_url: matchedVoter.passport_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
      };

      setCurrentUser(electorUser);
      setAvailableUsers((prev) => {
        if (!prev.some((u) => u.id === electorUser.id)) {
          return [...prev, electorUser];
        }
        return prev;
      });
      return true;
    }

    // Generic fallback for testing
    if (cleanPin.length === 6 && cleanId.length >= 3) {
      const genericElector: User = {
        id: `usr-voter-${Date.now()}`,
        email: cleanId.includes('@') ? cleanId : `${cleanId.toLowerCase()}@citizens.ng`,
        full_name: `Accredited Elector (${identifier.slice(0, 12)})`,
        role: 'voter',
        voter_id: identifier,
        vin_number: identifier,
        state: 'Lagos',
        lga: 'Ikeja',
        department: 'Federal Elector Register',
        status: 'verified',
        two_factor_enabled: false,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
      };
      setCurrentUser(genericElector);
      return true;
    }

    return false;
  };

  const verify2FACode = (code: string): boolean => {
    if (code === '123456' || code.length === 6) {
      if (pendingUser) {
        setCurrentUser(pendingUser);
        setPendingUser(null);
      }
      setTwoFactorRequired(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentUser(null);
    setPendingUser(null);
    setTwoFactorRequired(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const switchUserRole = (role: UserRole) => {
    const target = availableUsers.find((u) => u.role === role);
    if (target) {
      setCurrentUser(target);
    } else {
      const generic: User = {
        id: `usr-${role}-${Date.now()}`,
        email: `${role}@elections.gov.ng`,
        full_name: `${role.toUpperCase()} Persona`,
        role,
        voter_id: `${role.slice(0, 3).toUpperCase()}-9999`,
        department: 'Independent Electoral Commission',
        status: 'verified',
        two_factor_enabled: false,
        created_at: new Date().toISOString(),
      };
      setAvailableUsers((prev) => [...prev, generic]);
      setCurrentUser(generic);
    }
  };

  const switchUserById = (userId: string) => {
    const target = availableUsers.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setAvailableUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const resetPasswordRequest = async (email: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 500));
    return Boolean(email);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isLoading,
        login,
        loginWithVoterIdAndPin,
        logout,
        switchUserRole,
        switchUserById,
        updateProfile,
        availableUsers,
        twoFactorRequired,
        verify2FACode,
        verify2faCode: verify2FACode,
        is2faModalOpen: twoFactorRequired,
        setIs2faModalOpen: setTwoFactorRequired,
        pending2faUser: pendingUser,
        resetPasswordRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
