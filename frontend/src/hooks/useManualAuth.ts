import { useState, useEffect, useCallback } from 'react';
import { useActor } from './useActor';

const MANUAL_AUTH_KEY = 'bonitara_manual_auth';

export interface ManualAuthUser {
  email: string;
  name: string;
  isAdmin: boolean;
}

interface ManualAuthState {
  user: ManualAuthUser | null;
  isAuthenticated: boolean;
}

export function useManualAuth() {
  const { actor } = useActor();
  const [authState, setAuthState] = useState<ManualAuthState>(() => {
    try {
      const stored = localStorage.getItem(MANUAL_AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { user: parsed, isAuthenticated: true };
      }
    } catch {
      // ignore
    }
    return { user: null, isAuthenticated: false };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manualLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!actor) {
      setError('Service not available. Please try again.');
      return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Check admin first
      const isAdmin = await actor.adminCheck(email, password);
      if (isAdmin) {
        const user: ManualAuthUser = { email, name: 'Admin', isAdmin: true };
        localStorage.setItem(MANUAL_AUTH_KEY, JSON.stringify(user));
        setAuthState({ user, isAuthenticated: true });
        return true;
      }
      // Check regular user
      const success = await actor.loginUser(email, password);
      if (success) {
        const user: ManualAuthUser = { email, name: email.split('@')[0], isAdmin: false };
        localStorage.setItem(MANUAL_AUTH_KEY, JSON.stringify(user));
        setAuthState({ user, isAuthenticated: true });
        return true;
      } else {
        setError('Invalid email or password. Please try again.');
        return false;
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [actor]);

  const manualRegister = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    if (!actor) {
      setError('Service not available. Please try again.');
      return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      const success = await actor.registerUser({ name, email, password });
      if (success) {
        const user: ManualAuthUser = { email, name, isAdmin: false };
        localStorage.setItem(MANUAL_AUTH_KEY, JSON.stringify(user));
        setAuthState({ user, isAuthenticated: true });
        return true;
      } else {
        setError('An account with this email already exists.');
        return false;
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [actor]);

  const manualLogout = useCallback(() => {
    localStorage.removeItem(MANUAL_AUTH_KEY);
    setAuthState({ user: null, isAuthenticated: false });
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    isManuallyAuthenticated: authState.isAuthenticated,
    manualUser: authState.user,
    manualLogin,
    manualRegister,
    manualLogout,
    isLoading,
    error,
    clearError,
  };
}
