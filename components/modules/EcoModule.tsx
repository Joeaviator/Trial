
import React, { useState, useMemo } from 'react';
import { EcoShift, ActivityGuide } from '../../types';
import { getActivityGuide } from '../../geminiService';
import InputArea from '../InputArea';
import HistoryList from '../HistoryList';

interface EcoModuleProps {
  history: EcoShift[];
  onComplete: (shift: EcoShift) => void;
}

const EcoModule: React.FC<EcoModuleProps> = ({ history, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [currentGuide, setCurrentGuide] = useState<ActivityGuide | null>(null);
  const [activeActivity, setActiveActivity] = useState('');
  const [verifiedSubSteps, setVerifiedSubSteps] = useState<Set<string>>(new Set());

  const handleSuggest = async (activity: string) => {
    setLoading(true);
    setActiveActivity(activity);
    setVerifiedSubSteps(new Set());
    try {
      const guide = await getActivityGuide(activity);
      setCurrentGuide(guide);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubStep = (id: string) => {
    setVerifiedSubSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalSubSteps = useMemo(() => {
    if (!currentGuide) return 0;
    return currentGuide.steps.reduce((acc, step) => acc + step.subSteps.length, 0);
  }, [currentGuide]);

  const progress = useMemo(() => {
    if (totalSubSteps === 0) return 0;
    return (verifiedSubSteps.size / totalSubSteps) * 100;
  }, [verifiedSubSteps, totalSubSteps]);

  const commitActivity = () => {
    if (!currentGuide || progress < 100) return;
    onComplete({
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      activity: activeActivity,
      shift: "OPTIMIZATION_COMPLETE",
      personalWin: "Verified Real-World Gain",
      ecoWin: "Effective Resource Deployment",
      timestamp: Date.now()
    });
    setCurrentGuide(null);
  };

  return (
    <div className="space-y-20 fade-entry max-w-5xl mx-auto pb-24">
      <section className="bg-white p-16 rounded-[4rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <h2 className="text-5xl font-black tracking-tighter mb-4 text-slate-900 uppercase leading-none">Optimization Terminal</h2>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.5em] border-l-4 border-teal-500 pl-6 py-1">Tactical Real-World Efficiency Protocols</p>
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
             <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse shadow-lg shadow-teal-500/50"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mono">Engine Online</span>
          </div>
        </div>
        <InputArea onSuggest={handleSuggest} isLoading={loading} />
      </section>

      {currentGuide && (
        <div className="animate-in slide-in-from-bottom-16 duration-700 space-y-20">
          <div className="bg-white p-16 md:p-24 rounded-[5rem] shadow-3xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none">
              <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24"><path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
              <div>
                <h3 className="text-7xl font-black tracking-tighter text-slate-900 mb-8 uppercase leading-none">{activeActivity}</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 bg-teal-50/50 border border-teal-100 px-6 py-2.5 rounded-2xl">
                    <span className="text-lg">📈</span>
                    <span className="text-[11px] font-black text-teal-800 uppercase tracking-widest">Growth Vector</span>
                  </div>
                  <div className="flex items-center gap-3 bg-lime-50/50 border border-lime-100 px-6 py-2.5 rounded-2xl">
                    <span className="text-lg">🛡️</span>
                    <span className="text-[11px] font-black text-lime-800 uppercase tracking-widest">Risk Mitigated</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setCurrentGuide(null)} className="group flex items-center gap-3 text-slate-400 hover:text-red-600 transition-all font-black uppercase text-[11px] tracking-widest bg-slate-50 px-10 py-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl active:scale-95">
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                Abort Protocol
              </button>
            </div>

            <div className="mb-24 p-12 bg-slate-50 rounded-[4rem] border border-slate-100 shadow-inner">
              <div className="flex justify-between items-end mb-8 px-4">
                <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em]">Protocol Sync Mastery</span>
                <span className="text-4xl font-black text-slate-900 tracking-tighter mono">{Math.round(progress)}<span className="text-xl text-slate-300 ml-1">%</span></span>
              </div>
              <div className="h-6 w-full bg-slate-200/50 rounded-full overflow-hidden p-1.5 border border-slate-300/30">
                <div 
                  className="h-full bg-gradient-to-r from-teal-600 via-teal-500 to-lime-500 rounded-full transition-all duration-1000 shadow-xl"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-40 mb-20">
              {currentGuide.steps.map((step) => (
                <div key={step.stepNumber} className="group">
                  <div className="grid lg:grid-cols-[1fr_550px] gap-24 items-start">
                    <div className="space-y-16">
                      <div className="flex gap-10 items-start">
                        <span className="text-9xl font-black text-slate-50 group-hover:text-teal-600/20 transition-all leading-none mt-[-20px]">{step.stepNumber}</span>
                        <div>
                          <h4 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-6 leading-tight border-b-8 border-teal-50 pb-4 inline-block">{step.instruction}</h4>
                          <p className="text-slate-600 text-xl font-semibold leading-relaxed italic max-w-lg">{step.detail}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-5">
                        <div className="flex items-center gap-4 mb-8 px-2">
                          <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Validation Requirements</h5>
                          <div className="h-[1px] flex-1 bg-slate-100"></div>
                        </div>
                        {step.subSteps.map((sub) => (
                          <div 
                            key={sub.id} 
                            onClick={() => toggleSubStep(sub.id)}
                            className={`flex items-start gap-8 p-10 rounded-[3rem] cursor-pointer transition-all duration-500 border ${
                              verifiedSubSteps.has(sub.id) 
                                ? 'bg-teal-50 border-teal-200 shadow-inner' 
                                : 'bg-white border-slate-100 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-100/30'
                            }`}
                          >
                            <div className={`mt-1.5 w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                              verifiedSubSteps.has(sub.id) ? 'bg-teal-600 border-teal-600 shadow-xl rotate-[360deg]' : 'border-slate-300 bg-slate-50 group-hover:border-teal-300'
                            }`}>
                              {verifiedSubSteps.has(sub.id) && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" d="M5 13l4 4L19 7"/></svg>}
                            </div>
                            <div>
                              <span className={`text-lg font-black uppercase tracking-tight block mb-2 ${verifiedSubSteps.has(sub.id) ? 'text-teal-900' : 'text-slate-800'}`}>
                                {sub.label}
                              </span>
                              <p className="text-sm text-slate-500 font-bold leading-relaxed">{sub.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="relative sticky top-24">
                      {step.visual ? (
                        <div className="aspect-[4/3] w-full rounded-[4rem] border border-slate-100 overflow-hidden shadow-4xl group-hover:shadow-teal-100/50 transition-all duration-700">
                          <img src={step.visual} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={step.instruction} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-12 flex flex-col justify-end">
                            <span className="mono text-[12px] font-black text-white uppercase tracking-[0.6em] mb-4 opacity-70">Simulation Node {step.stepNumber}</span>
                            <div className="h-1 w-24 bg-teal-500 rounded-full"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[4/3] w-full bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100 flex items-center justify-center p-12 text-center">
                          <div>
                            <div className="w-16 h-16 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-8"></div>
                            <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Synthesizing Protocol Visuals...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={commitActivity}
              disabled={progress < 100}
              className={`w-full py-12 font-black text-3xl tracking-tighter rounded-[3.5rem] transition-all duration-500 shadow-2xl ${
                progress === 100 
                  ? 'bg-slate-900 text-white hover:bg-black hover:shadow-teal-500/20 active:scale-[0.98]' 
                  : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
              }`}
            >
              {progress === 100 ? 'FINALIZE & DEPLOY PROTOCOL' : 'VALIDATE ALL NODES FOR DEPLOYMENT'}
            </button>
          </div>
        </div>
      )}

      <section>
        <div className="flex items-center gap-8 mb-16 px-6">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">Protocol Archives</h2>
          <div className="h-[1px] flex-1 bg-slate-100"></div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mono">DB_VER: 1.0.4</span>
        </div>
        <HistoryList history={history} />
      </section>
    </div>
  );
};

export default EcoModule;
