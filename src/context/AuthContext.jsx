import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  email: 'demo@brightentechnology.com',
  name: 'HR Manager',
  initials: 'HR',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((email, _password) => {
    // Demo-only auth; swap for real service call.
    setUser({ ...DEMO_USER, email: email || DEMO_USER.email });
    return Promise.resolve(true);
  }, []);

  const demoLogin = useCallback(() => {
    setUser(DEMO_USER);
    return Promise.resolve(true);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, demoLogin, logout }),
    [user, login, demoLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
