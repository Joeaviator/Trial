import React, { useState, useEffect } from 'react';
import { UserState, TopicStructure, EcoShift } from './types';
import { authService } from './authService';
import { isSupabaseConfigured } from './supabaseClient';
import Header from './components/Header';
import Navigation from './components/Navigation';
import AuthPage from './components/AuthPage';

import MindModule from './components/modules/MindModule';
import SkillsModule from './components/modules/SkillsModule';
import EcoModule from './components/modules/EcoModule';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userState, setUserState] = useState<UserState>({ 
    impactScore: 1, 
    moodHistory: [], 
    exploredTopics: [],
    quizHistory: [],
    ecoHistory: [],
    lastActionTimestamp: Date.now(),
    dailyActionCount: 0
  });
  const [activeTab, setActiveTab] = useState<'mind' | 'skills' | 'eco'>('eco');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Strict Auth Synchronization
    const authListener = authService.onAuthStateChange((user) => {
      if (mounted) {
        setCurrentUser(user);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (authListener?.data?.subscription) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const fetchState = async () => {
      if (currentUser && currentUser.id) {
        try {
          const state = await authService.getUserState(currentUser.id);
          if (state) setUserState(state);
        } catch (err) {
          console.error("Failed to load persistent user state", err);
        }
      }
    };
    fetchState();
  }, [currentUser]);

  const incrementImpact = (percentGain: number) => {
    setUserState(prev => {
      const newScore = Math.min(100, Math.round(prev.impactScore + percentGain));
      const newState = {
        ...prev,
        impactScore: newScore,
        lastActionTimestamp: Date.now(),
        dailyActionCount: prev.dailyActionCount + 1
      };
      
      if (currentUser && currentUser.id) {
        authService.saveUserState(currentUser.id, newState);
      }
      
      return newState;
    });
  };

  const handleTopicExplored = (topic: TopicStructure) => {
    setUserState(prev => {
      const exists = prev.exploredTopics.find(t => t.topic.toLowerCase() === topic.topic.toLowerCase());
      if (exists) return prev;
      const newState = {
        ...prev,
        exploredTopics: [topic, ...prev.exploredTopics].slice(0, 10)
      };
      if (currentUser && currentUser.id) authService.saveUserState(currentUser.id, newState);
      return newState;
    });
    incrementImpact(1);
  };

  const handleOptimizationComplete = (shift: EcoShift) => {
    setUserState(prev => {
      const newState = {
        ...prev,
        ecoHistory: [shift, ...prev.ecoHistory].slice(0, 50)
      };
      if (currentUser && currentUser.id) authService.saveUserState(currentUser.id, newState);
      return newState;
    });
    incrementImpact(3);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-slate-900 border-t-teal-600 rounded-full animate-spin mx-auto shadow-xl"></div>
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] mono animate-pulse">Establishing Secure Session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthPage 
        onAuthSuccess={(email) => {
          console.log(`Auth initiated for ${email}`);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen pb-40 bg-[#F8FAFC] text-[#1E293B] selection:bg-[#0D9488] selection:text-white fade-entry">
      <div className="max-w-5xl mx-auto px-4 pt-10">
        <Header score={userState.impactScore} onLogout={() => authService.logout()} />
        
        {!isSupabaseConfigured && (
          <div className="mb-8 p-10 bg-red-50 border-2 border-red-200 rounded-[3rem] text-center shadow-xl">
             <h3 className="text-red-800 font-black text-xl uppercase tracking-tighter mb-2">Configuration Vault Locked</h3>
             <p className="text-[11px] font-black text-red-700 uppercase tracking-[0.3em]">
               System variables are not detected. Verify SUPABASE_URL and SUPABASE_ANON_KEY in your deployment environment.
             </p>
          </div>
        )}

        <main className="mt-12">
          {activeTab === 'eco' && (
            <EcoModule 
              history={userState.ecoHistory}
              onComplete={handleOptimizationComplete}
            />
          )}
          {activeTab === 'mind' && (
            <MindModule 
              moodHistory={userState.moodHistory} 
              onMoodLog={(mood) => {
                const log = { id: Date.now().toString(), mood, timestamp: Date.now() };
                setUserState(prev => {
                  const newState = { ...prev, moodHistory: [log, ...prev.moodHistory].slice(0, 50) };
                  if (currentUser && currentUser.id) authService.saveUserState(currentUser.id, newState);
                  return newState;
                });
                incrementImpact(1);
              }}
              onBreathComplete={() => incrementImpact(2)}
            />
          )}
          {activeTab === 'skills' && (
            <SkillsModule 
              onTopicExplored={handleTopicExplored}
            />
          )}
        </main>

        <Navigation activeTab={activeTab} setActiveTab={(tab: any) => setActiveTab(tab)} />

        <footer className="mt-24 text-center text-[11px] text-slate-300 font-black uppercase tracking-[0.5em] mono pb-12">
          AllEase Encrypted Cloud • Identity: {currentUser.email}
        </footer>
      </div>
    </div>
  );
};

export default App;