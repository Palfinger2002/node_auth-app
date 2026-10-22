import React, { useMemo, useState, useCallback } from 'react';
import { accessTokenService } from '../services/accessTokenService';
import { authService } from '../services/authService';
import { User } from '../types/user';

/* eslint-disable @typescript-eslint/no-unused-vars */
const AuthContext = React.createContext({
  isChecked: false,
  currentUser: null as User | null,
  checkAuth: async () => {},
  activate: async (_name: string, _email: string, _token: string) => {},
  login: async (_name: string, _email: string, _password: string) => {},
  logout: async () => {},
});
/* eslint-enable @typescript-eslint/no-unused-vars */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isChecked, setChecked] = useState(false);

  async function activate(name: string, email: string, token: string) {
    const { accessToken, user } = await authService.activate(
      name,
      email,
      token,
    );

    accessTokenService.save(accessToken);
    setCurrentUser(user);
  }

  const checkAuth = useCallback(async () => {
    try {
      const { accessToken, user } = await authService.refresh();

      accessTokenService.save(accessToken);
      setCurrentUser(user);
    } catch {
      accessTokenService.remove();
      setCurrentUser(null);
    } finally {
      setChecked(true);
    }
  }, []);

  async function login(name: string, email: string, password: string) {
    const { accessToken, user } = await authService.login(
      name,
      email,
      password,
    );

    accessTokenService.save(accessToken);
    setCurrentUser(user);
  }

  async function logout() {
    await authService.logout();

    accessTokenService.remove();
    setCurrentUser(null);
  }

  const value = useMemo(
    () => ({
      isChecked,
      currentUser,
      checkAuth,
      activate,
      login,
      logout,
    }),
    [currentUser, isChecked],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
