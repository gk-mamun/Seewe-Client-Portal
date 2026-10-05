import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';
import { companyService, isProfileComplete, PROFILE_REQUIRED } from '../services/companyService.js';

const AuthContext = createContext(null);

/**
 * Holds the signed-in client and exposes login/logout helpers. Restores
 * from localStorage on boot so a page refresh keeps the user signed in.
 *
 * Company-profile completeness is derived from GET /client/details (which
 * carries the full field set + contacts), fetched whenever a client is signed
 * in. `isCompanyComplete` gates the sidebar menu and the route guard.
 */
export function AuthProvider({ children }) {
  const [client, setClient] = useState(() => authService.restore());
  const [profile, setProfile] = useState(null);          // /client/details payload
  const [profileChecked, setProfileChecked] = useState(false); // first fetch done?

  /** (Re)fetch the company details and recompute completeness. */
  const refreshProfile = useCallback(async () => {
    try {
      const d = await companyService.getDetails();
      setProfile(d);
      return d;
    } catch {
      setProfile(null);
      return null;
    } finally {
      setProfileChecked(true);
    }
  }, []);

  // Load the details whenever we have an authenticated client.
  useEffect(() => {
    if (!client) {
      setProfile(null);
      setProfileChecked(false);
      return;
    }
    setProfileChecked(false);
    refreshProfile();
  }, [client?.id, refreshProfile]);

  const login = useCallback(async ({ username, password }) => {
    const next = await authService.login({ username, password });
    setClient(next);
    return next;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setClient(null);
    setProfile(null);
    setProfileChecked(false);
  }, []);

  const updateClient = useCallback((patch) => {
    const next = authService.updateCachedClient(patch);
    setClient(next);
    return next;
  }, []);

  const value = useMemo(() => {
    const isCompanyComplete = isProfileComplete(profile);
    return {
      client,
      // Friendly aliases for components that prefer the legacy name.
      user: client
        ? { name: client.company_name || client.username, email: client.email, initials: initialsOf(client) }
        : null,
      isAuthenticated: !!client,
      isCompanyComplete,
      companyChecked: profileChecked, // false until the details fetch completes
      refreshProfile,
      requiredFields: PROFILE_REQUIRED,
      login,
      logout,
      updateClient,
    };
  }, [client, profile, profileChecked, refreshProfile, login, logout, updateClient]);

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
