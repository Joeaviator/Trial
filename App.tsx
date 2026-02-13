
import React, { useState, useEffect } from 'react';
import { UserState, TopicStructure, EcoShift } from './types';
import { authService } from './authService';
import Header from './components/Header';
import Navigation from './components/Navigation';
import MindModule from './components/modules/MindModule';
import SkillsModule from './components/modules/SkillsModule';
import EcoModule from './components/modules/EcoModule';
import AuthPage from './components/AuthPage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(authService.getCurrentUser());
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

  useEffect(() => {
    if (currentUser) {
      const users = authService.getUsers();
      if (users[currentUser]) {
        setUserState(users[currentUser].state);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      authService.saveUserState(currentUser, userState);
    }
  }, [userState, currentUser]);

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

  if (!currentUser) return <AuthPage onAuthSuccess={(e) => setCurrentUser(e)} />;

  return (
    <div className="min-h-screen pb-40 bg-[#F8FAFC] text-[#1E293B] selection:bg-[#00C2B2] selection:text-white">
      <div className="max-w-5xl mx-auto px-4 pt-10">
        <Header score={userState.impactScore} onLogout={() => { authService.setCurrentUser(null); setCurrentUser(null); }} />
        
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
                setUserState(prev => ({ ...prev, moodHistory: [log, ...prev.moodHistory].slice(0, 50) }));
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
        </main>

        <Navigation activeTab={activeTab} setActiveTab={(tab: any) => setActiveTab(tab)} />

        <footer className="mt-24 text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest mono">
          AllEase Sigma Protocol | Light Mode Active
        </footer>
      </div>
    </div>
  );
};

export default App;
