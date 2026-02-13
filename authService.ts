
import { UserState } from './types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const DEFAULT_STATE: UserState = {
  impactScore: 1,
  moodHistory: [],
  exploredTopics: [],
  quizHistory: [],
  ecoHistory: [],
  lastActionTimestamp: Date.now(),
  dailyActionCount: 0
};

export const authService = {
  register: async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase infrastructure is not configured. Access is currently locked.");
    }
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password: pass 
    });
    
    if (error) throw error;
    
    if (data.user) {
      // Mandatory: Create user profile in the database to enable state persistence
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: data.user.id, 
          email: data.user.email, 
          state: DEFAULT_STATE 
        });
      if (profileError) console.error("Database initialization failed:", profileError);
    }
    return data.user;
  },

  login: async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase infrastructure is not configured. Check Vercel environment variables.");
    }
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password: pass 
    });
    if (error) throw error;
    return data.user;
  },

  logout: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    // Hard reset of the application state
    window.location.href = '/';
  },

  getUserState: async (userId: string): Promise<UserState> => {
    if (!isSupabaseConfigured) return DEFAULT_STATE;
    const { data, error } = await supabase
      .from('profiles')
      .select('state')
      .eq('id', userId)
      .single();
    
    if (error || !data) return DEFAULT_STATE;
    return data.state as UserState;
  },

  saveUserState: async (userId: string, state: UserState) => {
    if (!isSupabaseConfigured) return;
    await supabase
      .from('profiles')
      .update({ state })
      .eq('id', userId);
  },

  onAuthStateChange: (callback: (user: any) => void) => {
    if (!isSupabaseConfigured) {
      // Signal 'no user' immediately if infrastructure is missing
      setTimeout(() => callback(null), 0);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });

    return { data: { subscription } };
  }
};
