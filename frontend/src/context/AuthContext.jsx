import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/api/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const existing = authService.getSession();
    setSession(existing);
    setIsInitializing(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await authService.login(credentials);
    if (result.success) {
      setSession(result.data);
    }
    return result;
  }, []);

  const register = useCallback(async (payload) => {
    return authService.registerStudent(payload);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isInitializing,
      role: session?.role ?? null,
      login,
      register,
      logout,
    }),
    [session, isInitializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
