import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isSupabaseEnabled, supabase } from '../lib/supabase';
import { loadAuth, saveAuth, wipeAllLocalData, type StoredAuth } from '../lib/store';
import { isNative } from '../native';

interface AuthValue {
  auth: StoredAuth | null;
  ready: boolean;
  signUpEmail: (p: { email: string; username: string; country: string; avatarUrl: string | null }) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signInApple: () => Promise<void>;
  signOut: () => void;
  /** Permanently delete the account + all data (App Store Guideline 5.1.1(v)). */
  deleteAccount: () => Promise<void>;
  usingSupabase: boolean;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // In demo mode we restore from localStorage. With Supabase you'd subscribe
    // to supabase.auth.onAuthStateChange and hydrate the profile here.
    setAuth(loadAuth());
    setReady(true);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      auth,
      ready,
      usingSupabase: isSupabaseEnabled,
      async signUpEmail({ email, username, country, avatarUrl }) {
        if (isSupabaseEnabled && supabase) {
          // Magic-link / passwordless flow keeps the demo credential-free.
          await supabase.auth.signInWithOtp({
            email,
            options: { data: { username, country, avatar_url: avatarUrl } },
          });
        }
        const next: StoredAuth = { email, username, country, avatarUrl };
        saveAuth(next);
        setAuth(next);
      },
      async signInGoogle() {
        if (isSupabaseEnabled && supabase) {
          await supabase.auth.signInWithOAuth({ provider: 'google' });
          return;
        }
        const next: StoredAuth = {
          email: 'you@studyarena.app',
          username: 'you',
          country: 'DE',
          avatarUrl: null,
        };
        saveAuth(next);
        setAuth(next);
      },
      async signInApple() {
        // Sign in with Apple via Supabase OAuth — opens the system Apple sheet
        // (ASWebAuthenticationSession) on iOS and a popup on the web. This avoids
        // a native plugin (the community Apple plugin has no Capacitor 8 build yet)
        // while still satisfying App Store Guideline 4.8.
        if (isSupabaseEnabled && supabase) {
          await supabase.auth.signInWithOAuth({
            provider: 'apple',
            options: isNative ? { redirectTo: 'com.majusmok.studyarena://auth/callback' } : undefined,
          });
          return;
        }
        const next: StoredAuth = {
          email: 'you@studyarena.app',
          username: 'you',
          country: 'DE',
          avatarUrl: null,
        };
        saveAuth(next);
        setAuth(next);
      },
      signOut() {
        if (isSupabaseEnabled && supabase) void supabase.auth.signOut();
        saveAuth(null);
        setAuth(null);
      },
      async deleteAccount() {
        // With Supabase you'd invoke an edge function / RPC that deletes the
        // auth user and cascades their rows before clearing the local session.
        if (isSupabaseEnabled && supabase) {
          try {
            await supabase.rpc('delete_current_user');
          } catch {
            /* surface handled by caller; still clear local session */
          }
          await supabase.auth.signOut();
        }
        wipeAllLocalData();
        saveAuth(null);
        setAuth(null);
      },
    }),
    [auth, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
