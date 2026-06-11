import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

/**
 * Holds the signed-in client and exposes login/logout helpers. Restores
 * from localStorage on boot so a page refresh keeps the user signed in.
 *
 * Shape of `client` (matches the Laravel /client/login response):
 *   { id, company_name, company_address, country, email, username }
 */
export function AuthProvider({ children }) {
  const [client, setClient] = useState(() => authService.restore());

  const login = useCallback(async ({ username, password }) => {
    const next = await authService.login({ username, password });
    setClient(next);
    return next;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setClient(null);
  }, []);

  const updateClient = useCallback((patch) => {
    const next = authService.updateCachedClient(patch);
    setClient(next);
    return next;
  }, []);

  const value = useMemo(() => {
    const isCompanyComplete = authService.isClientComplete(client);
    return {
      client,
      // Friendly aliases for components that prefer the legacy name.
      user: client
        ? { name: client.company_name || client.username, email: client.email, initials: initialsOf(client) }
        : null,
      isAuthenticated: !!client,
      isCompanyComplete,
      requiredFields: authService.REQUIRED_FIELDS,
      login,
      logout,
      updateClient,
    };
  }, [client, login, logout, updateClient]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function initialsOf(client) {
  const src = client.company_name || client.username || '';
  return src
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}
