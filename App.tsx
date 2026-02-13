import React, { useState, useEffect, useCallback } from 'react';
import { UserState, TopicStructure, EcoShift } from './types';
import { authService } from './authService';
import Header from './components/Header';
import Navigation from './components/Navigation';
import MindModule from './components/modules/MindModule';
import SkillsModule from './components/modules/SkillsModule';
import EcoModule from './components/modules/EcoModule';
import DatabaseModule from './components/modules/DatabaseModule';
import QuizModule from './components/modules/QuizModule';
import AuthPage from './components/AuthPage';

const DEFAULT_STATE: UserState = { 
  impactScore: 15.00, // Balanced starting quotient
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
  const [isCoreUnlocked, setIsCoreUnlocked] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);

  const themes = [
    { name: 'Classic', css: '' },
    { name: 'Stealth', css: 'grayscale contrast-125 brightness-90' },
    { name: 'Cyber', css: 'hue-rotate-[280deg] saturate-150 brightness-110' }
  ];

  const loadUserData = useCallback((email: string) => {
    const users = authService.getUsers();
    const userRecord = users[email];
    if (userRecord) {
      setUserState(userRecord.state);
      setIsInitialized(true);
      console.log(`AllEase: Profile loaded for ${email}`);
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
    setIsCoreUnlocked(false);
  };

  const incrementEfficiency = (percentGain: number) => {
    setUserState(prev => {
      const currentScore = typeof prev.impactScore === 'number' ? prev.impactScore : 15.00;
      const newScore = Math.min(100.00, Number((currentScore + percentGain).toFixed(2)));
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
    incrementEfficiency(1.50);
  };

  const handleEcoComplete = (shift: EcoShift) => {
    setUserState(prev => ({
      ...prev,
      ecoHistory: [shift, ...prev.ecoHistory].slice(0, 50)
    }));
    incrementEfficiency(10.00);
  };

  const handleAuthSuccess = (email: string) => {
    authService.setCurrentUser(email);
    setCurrentUser(email);
  };

  const cycleTheme = () => {
    setThemeIndex(prev => (prev + 1) % themes.length);
    incrementEfficiency(0.01); // Micro-gain for UX interaction
  };

  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className={`min-h-screen pb-40 bg-[#F8FAFC] text-[#1E293B] selection:bg-[#0D9488] selection:text-white transition-all duration-700 ${themes[themeIndex].css}`}>
      <div className="max-w-5xl mx-auto px-4 pt-10">
        <Header 
          score={userState.impactScore} 
          userId={currentUser}
          onLogout={handleLogout} 
          onCoreUnlock={() => setIsCoreUnlocked(true)}
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
                incrementEfficiency(1.00);
              }}
              onBreathComplete={() => incrementEfficiency(2.50)}
            />
          )}
          {activeTab === 'skills' && (
            <div className="space-y-12">
              <SkillsModule 
                onTopicExplored={handleTopicExplored}
                onInteraction={() => incrementEfficiency(0.50)}
              />
              <QuizModule 
                exploredTopics={userState.exploredTopics} 
                onQuizComplete={(res) => {
                  setUserState(prev => ({
                    ...prev,
                    quizHistory: [res, ...prev.quizHistory].slice(0, 20)
                  }));
                  incrementEfficiency(5.00);
                }} 
              />
            </div>
          )}
          {activeTab === 'db' && isCoreUnlocked && (
            <DatabaseModule userId={currentUser} />
          )}
        </main>

        <Navigation 
          activeTab={activeTab} 
          setActiveTab={(tab) => setActiveTab(tab)} 
          showCore={isCoreUnlocked}
        />

        <footer className="mt-24 pb-20 text-center">
          <button 
            onClick={cycleTheme}
            className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.5em] mono hover:text-teal-600 transition-colors cursor-pointer"
          >
            AllEase Sigma Protocol | Identity: {themes[themeIndex].name} | Session: {currentUser}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default App;