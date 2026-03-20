import React, { createContext, useContext, useState, useCallback } from 'react';
import { authGetUser, authGetToken, authSaveToken, authSaveUser, authRemoveToken, authRemoveUser, API_URL } from '@/lib/api';

interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  showAuth: boolean;
  authTab: 'signup' | 'login';
  openAuth: (tab?: 'signup' | 'login') => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(authGetUser());
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');

  const isLoggedIn = !!(user && authGetToken());

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message };
      authSaveToken(data.token); authSaveUser(data.user); setUser(data.user);
      return { success: true };
    } catch { return { success: false, message: 'Network error. Is the server running?' }; }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message };
      authSaveToken(data.token); authSaveUser(data.user); setUser(data.user);
      return { success: true };
    } catch { return { success: false, message: 'Network error. Is the server running?' }; }
  }, []);

  const logout = useCallback(async () => {
    const token = authGetToken();
    try { if (token) await fetch(`${API_URL}/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); } catch {}
    authRemoveToken(); authRemoveUser(); setUser(null);
  }, []);

  const openAuth = (tab?: 'signup' | 'login') => {
    if (tab) setAuthTab(tab);
    setShowAuth(true);
  };
  const closeAuth = () => setShowAuth(false);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout, showAuth, authTab, openAuth, closeAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
