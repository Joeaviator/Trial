
import React from 'react';
import { EcoShift } from '../types';

interface HistoryListProps {
  history: EcoShift[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="glass-light p-24 text-center border-dashed border-zinc-200 rounded-[3rem]">
        <div className="w-20 h-20 border border-zinc-100 rounded-full flex items-center justify-center mx-auto mb-8 text-zinc-300">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[11px] mono">No activity history detected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div 
          key={item.id} 
          className="glass-light p-8 flex items-center justify-between group hover:border-[#00C2B2]/40 transition-all rounded-[2rem] hover:shadow-lg bg-white/40"
        >
          <div className="flex items-center gap-10">
            <div className="text-[#00C2B2] mono text-[10px] font-bold bg-[#00C2B2]/5 px-3 py-1 rounded-full border border-[#00C2B2]/10">
              ID-{item.id.slice(0, 4).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-2">{item.activity}</p>
              <h4 className="text-[#1E293B] font-extrabold text-xl tracking-tight group-hover:text-[#00C2B2] transition-colors">{item.shift}</h4>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] text-[#00C2B2] font-bold uppercase tracking-widest bg-[#00C2B2]/5 px-5 py-2 rounded-full border border-[#00C2B2]/10">Validated</span>
            <p className="text-[11px] text-zinc-400 mt-3 font-medium mono">
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
