import React, { useState, useEffect, useCallback } from 'react';
import { UserState, TopicStructure, EcoShift } from './types';
import { authService } from './authService';
import Header from './components/Header';
import Navigation from './components/Navigation';
import MindModule from './components/modules/MindModule';
import SkillsModule from './components/modules/SkillsModule';
import EcoModule from './components/modules/EcoModule';
import DatabaseModule from './components/modules/DatabaseModule';
import AuthPage from './components/AuthPage';

const DEFAULT_STATE: UserState = { 
  impactScore: 1, 
  moodHistory: [], 
  exploredTopics: [],
  quizHistory: [],
  ecoHistory: [],
  lastActionTimestamp: Date.now(),
  dailyActionCount: 0
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(authService.getCurrentUser());
  const [userState, setUserState] = useState<UserState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<'mind' | 'skills' | 'eco' | 'db'>('eco');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user data strictly for the current tab's session
  const loadUserData = useCallback((email: string) => {
    const users = authService.getUsers();
    const userRecord = users[email];
    if (userRecord) {
      setUserState(userRecord.state);
      setIsInitialized(true);
    } else {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUserData(currentUser);
    } else {
      setIsInitialized(false);
    }
  }, [currentUser, loadUserData]);

  // Sync state to the global local vault
  useEffect(() => {
    if (currentUser && isInitialized) {
      authService.saveUserState(currentUser, userState);
    }
  }, [userState, currentUser, isInitialized]);

  const handleLogout = () => {
    authService.setCurrentUser(null);
    setCurrentUser(null);
    setUserState(DEFAULT_STATE);
    setIsInitialized(false);
  };

  const incrementEfficiency = (percentGain: number) => {
    setUserState(prev => {
      const newScore = Math.min(100, Math.round(prev.impactScore + percentGain));
      return {
        ...prev,
        impactScore: newScore,
        lastActionTimestamp: Date.now(),
        dailyActionCount: prev.dailyActionCount + 1
      };
    });
  };

  const handleTopicExplored = (topic: TopicStructure) => {
    setUserState(prev => {
      const exists = prev.exploredTopics.find(t => t.topic.toLowerCase() === topic.topic.toLowerCase());
      if (exists) return prev;
      return {
        ...prev,
        exploredTopics: [topic, ...prev.exploredTopics].slice(0, 10)
      };
    });
    incrementEfficiency(1);
  };

  const handleEcoComplete = (shift: EcoShift) => {
    setUserState(prev => ({
      ...prev,
      ecoHistory: [shift, ...prev.ecoHistory].slice(0, 50)
    }));
    incrementEfficiency(3);
  };

  const handleAuthSuccess = (email: string) => {
    authService.setCurrentUser(email);
    setCurrentUser(email);
  };

  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen pb-40 bg-[#F8FAFC] text-[#1E293B] selection:bg-[#00C2B2] selection:text-white">
      <div className="max-w-5xl mx-auto px-4 pt-10">
        <Header 
          score={userState.impactScore} 
          userId={currentUser}
          onLogout={handleLogout} 
        />
        
        <main className="mt-12">
          {activeTab === 'eco' && (
            <EcoModule 
              history={userState.ecoHistory}
              onComplete={handleEcoComplete}
            />
          )}
          {activeTab === 'mind' && (
            <MindModule 
              moodHistory={userState.moodHistory} 
              onMoodLog={(mood) => {
                const log = { id: Date.now().toString(), mood, timestamp: Date.now() };
                setUserState(prev => ({ 
                  ...prev, 
                  moodHistory: [log, ...prev.moodHistory].slice(0, 50) 
                }));
                incrementEfficiency(1);
              }}
              onBreathComplete={() => incrementEfficiency(2)}
            />
          )}
          {activeTab === 'skills' && (
            <SkillsModule 
              onTopicExplored={handleTopicExplored}
            />
          )}
          {activeTab === 'db' && (
            <DatabaseModule userId={currentUser} />
          )}
        </main>

        <Navigation 
          activeTab={activeTab} 
          setActiveTab={(tab) => setActiveTab(tab)} 
        />

        <footer className="mt-24 text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest mono">
          AllEase Sigma Protocol | Tab Session: {currentUser} | Multi-Thread Enabled
        </footer>
      </div>
    </div>
  );
};

export default App;