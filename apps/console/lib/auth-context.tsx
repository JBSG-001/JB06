'use client';

import React, { createContext, useContext, useState } from 'react';

export type ConsoleRole = 'DEVELOPER' | 'STAFF';

interface AuthContextType {
  role: ConsoleRole;
  user: {
    name: string;
    email: string;
    role: ConsoleRole;
  };
  switchRole: () => void;
  canAccessDevTools: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: 'DEVELOPER',
  user: {
    name: 'Devon',
    email: 'devon.developer@jb06.com',
    role: 'DEVELOPER',
  },
  switchRole: () => {},
  canAccessDevTools: true,
});

export const ConsoleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<ConsoleRole>('DEVELOPER');

  const switchRole = () => {
    setRole((prev) => (prev === 'DEVELOPER' ? 'STAFF' : 'DEVELOPER'));
  };

  const user = {
    name: role === 'DEVELOPER' ? 'Devon' : 'Sarah',
    email: role === 'DEVELOPER' ? 'devon.developer@jb06.com' : 'sarah.staff@jb06.com',
    role,
  };

  const canAccessDevTools = role === 'DEVELOPER';

  return (
    <AuthContext.Provider value={{ role, user, switchRole, canAccessDevTools }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useConsoleAuth = () => useContext(AuthContext);
