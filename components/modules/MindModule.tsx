import React, { useState, useEffect } from 'react';
import { MoodLog } from '../../types';
import { getSupportiveContent } from '../../geminiService';

interface MindModuleProps {
  moodHistory: MoodLog[];
  onMoodLog: (mood: string) => void;
  onBreathComplete: () => void;
}

const MindModule: React.FC<MindModuleProps> = ({ moodHistory, onMoodLog, onBreathComplete }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [timer, setTimer] = useState(0);
  const [supportContent, setSupportContent] = useState<{ text: string; visual: string } | null>(null);
  const [loadingSupport, setLoadingSupport] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isBreathing) {
      interval = setInterval(() => {
        setTimer(t => {
          if (t >= 30) { 
            setIsBreathing(false);
            onBreathComplete();
            return 0;
          }
          const cycle = t % 16;
          if (cycle < 4) setBreathPhase('Inhale');
          else if (cycle < 8) setBreathPhase('Hold');
          else if (cycle < 12) setBreathPhase('Exhale');
          else setBreathPhase('Pause');
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing, onBreathComplete]);

  const moodGroups = [
    {
      category: "Peak States",
      items: [
        { label: 'Peak', icon: '🎯' }, { label: 'Flow', icon: '🌊' }, { label: 'Locked', icon: '⚡' }, 
        { label: 'Determined', icon: '🦾' }, { label: 'Radiant', icon: '✨' }, { label: 'Joyful', icon: '🥳' }
      ]
    },
    {
      category: "Clarity & Awareness",
      items: [
        { label: 'Inspired', icon: '💡' }, { label: 'Clear', icon: '💎' }, { label: 'Thoughtful', icon: '🤔' },
        { label: 'Optimistic', icon: '🌅' }, { label: 'Zen', icon: '🧘' }, { label: 'Creative', icon: '🎨' }
      ]
    },
    {
      category: "Stability & Calm",
      items: [
        { label: 'Steady', icon: '⚖️' }, { label: 'Balanced', icon: '☯️' }, { label: 'Grounded', icon: '🌱' },
        { label: 'Content', icon: '😌' }, { label: 'Secure', icon: '🛡️' }, { label: 'Serene', icon: '🍃' }
      ]
    },
    {
      category: "Stress & Fatigue",
      items: [
        { label: 'Angry', icon: '😡' }, { label: 'Sad', icon: '😢' }, { label: 'Tired', icon: '😴' },
        { label: 'Explosive', icon: '🤯' }, { label: 'Drained', icon: '🪫' }, { label: 'Stormy', icon: '🌪️' }
      ]
    }
  ];

  const handleMoodSelect = async (moodLabel: string, icon: string) => {
    setLoadingSupport(true);
    setSupportContent(null);
    onMoodLog(icon);
    try {
      const content = await getSupportiveContent(moodLabel);
      setSupportContent(content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSupport(false);
    }
  };

  return (
    <div className="space-y-24 fade-entry max-w-6xl mx-auto pb-32">
      {/* Pacer Hero: Filled with visual rhythm */}
      <section className="bg-white p-16 md:p-24 text-center rounded-[5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
          <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-teal-50 px-8 py-2 rounded-full border border-teal-100 shadow-sm">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-ping"></div>
          <span className="text-[11px] text-teal-700 font-black uppercase tracking-[0.5em] mono">Neural Sync Active</span>
        </div>
        
        {isBreathing ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="relative w-80 h-80 flex items-center justify-center">
              <div className="absolute inset-0 border-[12px] border-slate-50 rounded-full"></div>
              <div 
                className={`absolute inset-8 bg-teal-50/50 border-4 border-teal-600 rounded-full transition-all duration-1000 ease-in-out ${
                  breathPhase === 'Inhale' ? 'scale-125 opacity-100' : 
                  breathPhase === 'Exhale' ? 'scale-50 opacity-40' : 
                  breathPhase === 'Hold' ? 'scale-125 opacity-100 border-dashed' : 'scale-50 opacity-40'
                }`}
              ></div>
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
                  {breathPhase}
                </span>
                <p className="mono text-sm text-teal-600 font-black tracking-[0.3em]">{30 - timer} SECS</p>
              </div>
            </div>
            <div className="mt-24 w-80 h-3 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200 shadow-inner">
              <div 
                className="h-full bg-teal-600 rounded-full transition-all duration-1000 ease-linear shadow-lg"
                style={{ width: `${(timer / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center">
            <h2 className="text-7xl font-black tracking-tighter mb-12 hero-text uppercase leading-none max-w-3xl mx-auto">Optimize Your Biological Pacer</h2>
            <button 
              onClick={() => setIsBreathing(true)}
              className="group flex items-center gap-8 px-24 py-10 text-sm font-black text-white bg-slate-900 hover:bg-teal-600 uppercase tracking-[0.4em] rounded-[3rem] transition-all duration-700 shadow-2xl hover:shadow-teal-500/50 active:scale-95"
            >
              <svg className="w-8 h-8 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Start Sync Session
            </button>
          </div>
        )}
      </section>

      {/* Mood Grid: 24+ emojis, more visual interest */}
      <section className="bg-white p-16 md:p-24 rounded-[5rem] border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 p-16 opacity-[0.02] pointer-events-none rotate-12">
          <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>

        <div className="text-center mb-20 relative z-10">
          <h3 className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-400 mb-6">Autonomous State Input</h3>
          <p className="text-3xl font-black text-slate-900 tracking-tight uppercase">Log Your Current Neural Profile</p>
        </div>

        <div className="grid gap-20 relative z-10">
          {moodGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-8">
              <div className="flex items-center gap-6 mb-4 px-2">
                <div className="h-0.5 w-12 bg-teal-600/30"></div>
                <h4 className="text-[11px] font-black text-teal-700 uppercase tracking-[0.4em]">{group.category}</h4>
                <div className="h-0.5 flex-1 bg-slate-50"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {group.items.map((m) => (
                  <button 
                    key={m.label} 
                    onClick={() => handleMoodSelect(m.label, m.icon)} 
                    className="group flex flex-col items-center gap-8 p-10 bg-slate-50/50 hover:bg-white rounded-[3.5rem] border border-transparent hover:border-teal-200 transition-all duration-500 active:scale-95 hover:shadow-2xl hover:shadow-teal-100/40"
                  >
                    <div className="w-20 h-20 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-center text-4xl group-hover:scale-110 transition-all duration-500 shadow-sm">
                      {m.icon}
                    </div>
                    <span className="text-[11px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest text-center">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Support Feedback: Large and soothing */}
        {(loadingSupport || supportContent) && (
          <div className="mt-28 p-12 md:p-20 bg-slate-50 border border-slate-200 rounded-[5rem] animate-in slide-in-from-bottom-16 duration-700 shadow-inner relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>

            {loadingSupport ? (
              <div className="flex flex-col items-center py-32 space-y-12">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] animate-pulse">Support Unit Syncing Calming Environments...</p>
              </div>
            ) : (
              <div className="space-y-20 relative z-10">
                <div className="flex items-center gap-8">
                  <div className="h-1 w-20 bg-teal-600 rounded-full"></div>
                  <h4 className="text-[14px] font-black uppercase tracking-[0.6em] text-teal-600">AllEase Support Protocol V4.2</h4>
                </div>
                <div className="grid lg:grid-cols-[1fr_500px] gap-24 items-center">
                  <div className="space-y-12">
                    <div className="relative">
                      <p className="text-4xl text-slate-900 font-black italic border-l-[16px] border-teal-100 pl-16 py-10 leading-[1.3] tracking-tighter">
                        "{supportContent?.text}"
                      </p>
                      <div className="absolute -top-6 -left-4 text-6xl text-teal-50 opacity-20 pointer-events-none font-serif">“</div>
                    </div>
                    <div className="flex items-center gap-6 bg-white/50 w-fit px-8 py-4 rounded-[2rem] border border-slate-100 shadow-sm">
                      <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] mono text-slate-400">Biological Validation Sequence Optimized</span>
                    </div>
                  </div>
                  {supportContent?.visual && (
                    <div className="group relative aspect-[3/4] lg:aspect-square w-full rounded-[4.5rem] overflow-hidden border border-slate-200 shadow-5xl">
                      <img src={supportContent.visual} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" alt="Serene Real-world Cityscape" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-16 flex flex-col justify-end">
                        <span className="text-white text-3xl font-black uppercase tracking-tighter mb-4">Calm Metropolitan Hub</span>
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                          <span className="text-[10px] text-teal-400 font-black uppercase tracking-[0.5em] mono">SIM_VECTOR_CALM</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center pt-12 border-t border-slate-200">
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] mono">SUPPORT_UNIT_DB // {Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Your mental state is archived securely to track your optimization curve.</p>
                  </div>
                  <button 
                    onClick={() => setSupportContent(null)}
                    className="text-[12px] font-black text-slate-500 hover:text-white uppercase tracking-[0.4em] px-16 py-8 bg-white border border-slate-100 hover:bg-slate-900 rounded-[3rem] transition-all shadow-md hover:shadow-2xl active:scale-95"
                  >
                    Clear Feed
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* History Archive: Visualized with status badges */}
      {moodHistory.length > 0 && (
        <section className="bg-white p-20 rounded-[5rem] border border-slate-100 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-20 px-6">
            <h3 className="text-[13px] font-black uppercase tracking-[0.6em] text-slate-400">Neural Log Timeline</h3>
            <div className="h-[1px] flex-1 bg-slate-100 ml-16"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8">
            {moodHistory.slice(0, 16).map((log) => (
              <div 
                key={log.id} 
                className="group bg-slate-50 border border-slate-100 p-10 rounded-[3.5rem] flex flex-col items-center gap-6 hover:border-teal-300 hover:bg-white transition-all duration-700 shadow-sm hover:shadow-3xl"
              >
                <span className="text-5xl group-hover:scale-125 transition-transform">{log.mood}</span>
                <div className="text-center">
                  <p className="text-[10px] text-slate-900 font-black mono bg-slate-200 group-hover:bg-teal-50 px-4 py-1.5 rounded-full transition-colors">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MindModule;