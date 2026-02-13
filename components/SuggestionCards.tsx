
import React from 'react';
import { EcoShift } from '../types';

interface SuggestionCardsProps {
  shift: EcoShift;
  onComplete: () => void;
  onDismiss: () => void;
}

const SuggestionCards: React.FC<SuggestionCardsProps> = ({ shift, onComplete, onDismiss }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#00FF66]/5 border border-[#00FF66]/20 p-8 relative">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-[#00FF66] font-black text-[10px] uppercase tracking-[0.3em] mono italic">Target Shift Protocol</h3>
          <button 
            onClick={onDismiss}
            className="text-zinc-600 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-3xl font-black text-white italic tracking-tighter uppercase">{shift.shift}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-dark p-8 border-l-4 border-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white text-xl">⚡</span>
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 mono">Personal Gain</h4>
          </div>
          <p className="text-zinc-200 leading-relaxed font-bold italic uppercase text-sm tracking-wide">{shift.personalWin}</p>
        </div>

        <div className="glass-dark p-8 border-l-4 border-[#00FF66]">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#00FF66] text-xl">🌐</span>
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#00FF66] mono">Ecosystem ROI</h4>
          </div>
          <p className="text-zinc-200 leading-relaxed font-bold italic uppercase text-sm tracking-wide">{shift.ecoWin}</p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-6 bg-white hover:bg-[#00FF66] text-black font-black text-xl uppercase italic tracking-tighter shadow-2xl transition-all active:scale-[0.98]"
      >
        Commit to Protocol <span className="opacity-40 text-sm ml-4 mono font-normal tracking-normal not-italic">+10.00 IMPACT</span>
      </button>
    </div>
  );
};

export default SuggestionCards;
