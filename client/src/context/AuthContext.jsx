import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data.data.user);
      return response.data.data.user;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      await refreshUser();
      setLoading(false);
    };

    bootstrap();
  }, []);

  const login = async (payload) => {
    const response = await authService.login(payload);
    const currentUser = response.data.data.user;
    setUser(currentUser);
    return currentUser;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    const currentUser = response.data.data.user;
    setUser(currentUser);
    return currentUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      login,
      register,
      logout,
      refreshUser,
      isAuthenticated: !!user,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
