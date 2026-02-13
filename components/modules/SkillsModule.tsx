
import React, { useState } from 'react';
import { TopicStructure } from '../../types';
import { getTopicStructure, getSubtopicExplanation } from '../../geminiService';

interface SkillsModuleProps {
  onTopicExplored: (topic: TopicStructure) => void;
}

const SkillsModule: React.FC<SkillsModuleProps> = ({ onTopicExplored }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [explaining, setExplaining] = useState<string | null>(null);
  const [topicData, setTopicData] = useState<TopicStructure | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setTopicData(null);
    setExplanation(null);
    setExplaining(null);
    
    try {
      const data = await getTopicStructure(query);
      setTopicData(data);
      onTopicExplored(data);
    } catch (err) {
      console.error("Error fetching topic structure:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubtopicClick = async (subtopicTitle: string) => {
    if (!topicData) return;
    setExplaining(subtopicTitle);
    setExplanation(null);
    try {
      const detail = await getSubtopicExplanation(topicData.topic, subtopicTitle);
      setExplanation(detail);
    } catch (err) {
      console.error("Error fetching subtopic explanation:", err);
    } finally {
      setExplaining(null);
    }
  };

  const suggestions = ['Biomimicry', 'Urban Autonomy', 'Sonic Ergonomics', 'Quantum Logic'];

  return (
    <div className="space-y-20 fade-entry max-w-5xl mx-auto pb-24">
      {/* Engine Control Section */}
      <section className="bg-white rounded-[4rem] p-16 md:p-24 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-6">Insight Engine</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-[12px] max-w-lg mx-auto italic">Strategic Knowledge Extraction Protocol</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-6 relative z-10">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Command knowledge expansion..."
            className="flex-1 bg-slate-50 border border-slate-100 p-10 rounded-[3rem] outline-none text-2xl font-black focus:border-teal-500 focus:bg-white transition-all text-slate-900 shadow-inner"
          />
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-slate-900 text-white px-16 py-10 rounded-[3rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-black active:scale-95 transition-all disabled:bg-slate-50 disabled:text-slate-300"
          >
            {loading ? 'ANALYZING...' : 'EXTRACT'}
          </button>
        </form>

        <div className="flex flex-wrap gap-4 mt-12 justify-center relative z-10">
          {suggestions.map(tag => (
            <button 
              key={tag} 
              onClick={() => { setQuery(tag); }}
              className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-widest bg-white text-slate-500 border border-slate-100 px-8 py-4 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm hover:shadow-xl"
            >
              <span className="opacity-40 group-hover:opacity-100 transition-opacity">#</span>
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Structured Knowledge View */}
      {topicData && (
        <div className="space-y-16 animate-in zoom-in duration-700">
          <section className="bg-white rounded-[5rem] p-16 md:p-28 shadow-4xl border border-slate-100">
            <header className="mb-24 text-center">
              <h3 className="text-8xl font-black text-slate-900 tracking-tighter uppercase mb-12 leading-none">{topicData.topic}</h3>
              <div className="h-2 w-48 bg-teal-600 mx-auto rounded-full mb-16"></div>
              <div className="bg-slate-50 p-16 rounded-[4rem] border border-slate-100/50 shadow-inner relative">
                <div className="absolute -top-4 -left-4 bg-teal-600 text-white px-8 py-3 rounded-full text-[11px] font-black tracking-widest uppercase shadow-xl">Executive Summary</div>
                <p className="text-slate-800 leading-snug font-bold text-3xl italic tracking-tight text-left">
                  "{topicData.summary}"
                </p>
              </div>
            </header>
            
            <div className="grid sm:grid-cols-2 gap-10">
              {topicData.subtopics.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubtopicClick(sub.title)}
                  className={`text-left p-12 rounded-[3.5rem] border transition-all duration-700 group relative overflow-hidden ${
                    explaining === sub.title 
                    ? 'border-teal-600 bg-teal-50 ring-[16px] ring-teal-50/50 shadow-inner' 
                    : 'bg-white border-slate-100 hover:border-teal-200 hover:bg-slate-50/50 shadow-lg hover:shadow-3xl'
                  }`}
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="font-black text-slate-900 text-2xl uppercase tracking-tighter leading-none group-hover:text-teal-700 transition-colors">
                        {sub.title}
                      </h4>
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7-7 7"/></svg>
                      </div>
                    </div>
                    <p className="text-base text-slate-400 font-bold leading-relaxed italic group-hover:text-slate-600 transition-colors">{sub.description}</p>
                  </div>
                  <div className="absolute top-0 right-0 w-48 h-48 bg-teal-600/5 blur-[80px] rounded-full group-hover:bg-teal-600/10 transition-colors pointer-events-none"></div>
                </button>
              ))}
            </div>
          </section>

          {/* Detailed Context Injection (Deep Dive) */}
          {(explaining || explanation) && (
            <section className="bg-white rounded-[5rem] p-20 md:p-32 border-4 border-slate-50 shadow-5xl relative overflow-hidden animate-in slide-in-from-right duration-700">
              <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none">
                <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>

              {explaining ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-12">
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-8 border-slate-50 rounded-full" />
                    <div className="absolute inset-0 border-8 border-teal-600 border-t-transparent rounded-full animate-spin shadow-2xl shadow-teal-500/20" />
                  </div>
                  <p className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-400 animate-pulse">Decompressing Insight Domain: {explaining}</p>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-16">
                    <div className="h-0.5 w-24 bg-teal-600"></div>
                    <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-teal-600">Deep Protocol Expansion</h4>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-5xl text-slate-900 leading-[1.3] font-black italic border-l-[20px] border-teal-50 pl-16 py-8 tracking-tighter">
                      {explanation}
                    </p>
                  </div>
                  <div className="mt-24 flex justify-between items-end pt-16 border-t border-slate-100">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <span className="w-3 h-3 bg-teal-600 rounded-full shadow-lg shadow-teal-600/50"></span>
                        <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mono">KERNEL // GEMINI_FLASH_V3</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">Intelligence verified via non-intrusive support logic.</p>
                    </div>
                    <button 
                      onClick={() => { setExplanation(null); setExplaining(null); }}
                      className="text-[11px] font-black text-slate-400 hover:text-red-600 transition-all uppercase tracking-[0.4em] px-14 py-6 bg-slate-50 hover:bg-red-50 rounded-[2.5rem] shadow-sm hover:shadow-2xl"
                    >
                      Eject Domain
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsModule;
