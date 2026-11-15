'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type ConsoleRole = 'DEVELOPER' | 'STAFF';

export interface ConsoleUser {
  name: string;
  email: string;
  role: ConsoleRole;
  avatarUrl?: string;
  twoFactorVerified?: boolean;
}

interface AuthContextType {
  role: ConsoleRole;
  user: ConsoleUser;
  isAuthenticated: boolean;
  canAccessDevTools: boolean;
  switchRole: () => void;
  login: (email: string, targetRole: ConsoleRole) => void;
  logout: () => void;
}

const DEFAULT_DEV_USER: ConsoleUser = {
  name: 'Devon Developer',
  email: 'devon.developer@jb06.com',
  role: 'DEVELOPER',
  twoFactorVerified: true,
};

const DEFAULT_STAFF_USER: ConsoleUser = {
  name: 'Sarah Staff',
  email: 'sarah.staff@jb06.com',
  role: 'STAFF',
  twoFactorVerified: true,
};

const AuthContext = createContext<AuthContextType>({
  role: 'DEVELOPER',
  user: DEFAULT_DEV_USER,
  isAuthenticated: false,
  canAccessDevTools: true,
  switchRole: () => {},
  login: () => {},
  logout: () => {},
});

export const ConsoleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<ConsoleRole>('DEVELOPER');
  const [user, setUser] = useState<ConsoleUser>(DEFAULT_DEV_USER);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('jb06_console_auth');
      if (stored) {
        const parsed = JSON.parse(stored) as ConsoleUser;
        setUser(parsed);
        setRole(parsed.role || 'DEVELOPER');
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const login = (email: string, targetRole: ConsoleRole) => {
    const isDev = targetRole === 'DEVELOPER' || email.toLowerCase().includes('dev');
    const authUser: ConsoleUser = {
      name: isDev ? 'Devon Developer' : 'Sarah Staff',
      email: email || (isDev ? 'devon.developer@jb06.com' : 'sarah.staff@jb06.com'),
      role: isDev ? 'DEVELOPER' : 'STAFF',
      twoFactorVerified: true,
    };
    setUser(authUser);
    setRole(authUser.role);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('jb06_console_auth', JSON.stringify(authUser));
    } catch {}
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('jb06_console_auth');
    } catch {}
    router.push('/login');
  };

  const switchRole = () => {
    setRole((prevRole) => {
      const nextRole: ConsoleRole = prevRole === 'DEVELOPER' ? 'STAFF' : 'DEVELOPER';
      const nextUser = nextRole === 'DEVELOPER' ? DEFAULT_DEV_USER : DEFAULT_STAFF_USER;
      setUser(nextUser);
      if (isAuthenticated) {
        try {
          localStorage.setItem('jb06_console_auth', JSON.stringify(nextUser));
        } catch {}
      }
      return nextRole;
    });
  };

  const canAccessDevTools = role === 'DEVELOPER';

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isAuthenticated,
        canAccessDevTools,
        switchRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useConsoleAuth = () => useContext(AuthContext);
