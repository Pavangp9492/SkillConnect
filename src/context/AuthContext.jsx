
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  supabase,
  isSupabaseConfigured,
} from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the actual user profile from Supabase
  async function fetchUserProfile(userId) {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error('Unable to verify your account role: ' + error.message);
    }

    if (!data) {
      throw new Error('Your user profile was not found.');
    }

    return data;
  }

  // Check existing login session
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function initializeAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data.session?.user) {
          const currentUser = data.session.user;
          const currentProfile = await fetchUserProfile(currentUser.id);

          if (mounted) {
            setUser(currentUser);
            setProfile(currentProfile);
          }
        }
      } catch (error) {
        console.error('Authentication initialization error:', error.message);

        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Fetch the profile after the auth callback completes.
      Promise.resolve().then(async () => {
        try {
          const currentProfile = await fetchUserProfile(session.user.id);

          if (mounted) {
            setUser(session.user);
            setProfile(currentProfile);
          }
        } catch (error) {
          console.error('Profile verification failed:', error.message);

          if (mounted) {
            setUser(null);
            setProfile(null);
          }
        } finally {
          if (mounted) setLoading(false);
        }
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Real Supabase login
  async function login(email, password) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'Supabase is not configured. Please configure your environment variables.'
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      await supabase.auth.signOut();
      throw new Error('Login failed. User information was not returned.');
    }

    try {
      const currentProfile = await fetchUserProfile(data.user.id);

      if (currentProfile.role !== 'admin') {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);

        throw new Error(
          'Access denied. This account is not an administrator.'
        );
      }

      setUser(data.user);
      setProfile(currentProfile);

      return data;
    } catch (error) {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      throw error;
    }
  }

  // Demo login is intentionally disabled
  async function demoLogin() {
    throw new Error(
      'Demo login is disabled. Please use your Supabase administrator account.'
    );
  }

  // Logout
  async function logout() {
    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
    }

    setUser(null);
    setProfile(null);
  }

  // Only the verified database profile determines admin access
  const isAdmin = profile?.role === 'admin';

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    isDemoMode: false,
    login,
    demoLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
