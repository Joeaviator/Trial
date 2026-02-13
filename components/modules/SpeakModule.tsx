
import React from 'react';
import { speakPhrase } from '../../geminiService';

const SpeakModule: React.FC = () => {
  const commonPhrases = [
    { text: "Optimization phase starting", icon: "🚀", label: "START" },
    { text: "Break initiated", icon: "☕", label: "BREAK" },
    { text: "Session completed", icon: "🏁", label: "FINISH" },
    { text: "Task acknowledged", icon: "👍", label: "ACK" },
    { text: "Protocol rejected", icon: "❌", label: "REJECT" },
    { text: "Update required", icon: "🔄", label: "UPDATE" },
  ];

  const handleSpeak = (text: string) => {
    speakPhrase(text);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">Voice Interface</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-10">Professional Auditory Commands</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {commonPhrases.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSpeak(p.text)}
              className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl hover:border-teal-600 hover:bg-white transition-all group active:scale-95 shadow-sm"
            >
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{p.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-teal-600">{p.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 text-center tracking-widest">Custom Command Injection</h3>
        <div className="flex flex-col sm:flex-row gap-4">
           <input 
            type="text" 
            id="custom-speak"
            placeholder="TYPE COMMAND..."
            className="flex-1 bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl outline-none text-slate-900 font-bold uppercase tracking-widest focus:border-teal-600 transition-all text-sm"
          />
          <button 
            onClick={() => {
              const el = document.getElementById('custom-speak') as HTMLInputElement;
              if(el.value) handleSpeak(el.value);
            }}
            className="bg-slate-900 hover:bg-teal-600 text-white px-10 py-4 font-black rounded-xl transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            Execute
          </button>
        </div>
      </section>
    </div>
  );
};

export default SpeakModule;
