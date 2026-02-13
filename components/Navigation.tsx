import React from 'react';

interface NavigationProps {
  activeTab: 'mind' | 'skills' | 'eco' | 'db';
  setActiveTab: (tab: 'mind' | 'skills' | 'eco' | 'db') => void;
  showCore: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, showCore }) => {
  const allTabs = [
    { id: 'eco', label: 'Optimize', icon: '📊', visible: true },
    { id: 'skills', label: 'Archive', icon: '📑', visible: true },
    { id: 'mind', label: 'Focus', icon: '🧘', visible: true },
    { id: 'db', label: 'Core', icon: '🗄️', visible: showCore },
  ] as const;

  const tabs = allTabs.filter(t => t.visible);

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-fit bg-white/90 backdrop-blur-md rounded-[2.5rem] p-2 shadow-2xl flex gap-1.5 z-50 border border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center px-8 py-3 rounded-[2rem] transition-all duration-300 relative overflow-hidden group ${
            activeTab === tab.id 
              ? 'bg-slate-900 text-white' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <span className="text-lg relative z-10 mb-1">{tab.icon}</span>
          <span className="text-[10px] font-black uppercase tracking-widest relative z-10">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;