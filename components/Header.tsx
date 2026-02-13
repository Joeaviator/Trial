
import React from 'react';

interface HeaderProps {
  score: number;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ score, onLogout }) => {
  const roundedScore = Math.round(score);

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 pb-16 pt-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-6xl font-black tracking-tighter hero-text mb-2">
            All<span className="text-[#0D9488]">Ease</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#0D9488] animate-pulse"></span>
              <p className="text-[10px] font-black text-teal-700 uppercase tracking-[0.2em] mono">Operational</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-fit text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] hover:text-red-600 transition-all flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Secure Sign Out
        </button>
      </div>

      <div className="glass-premium p-10 rounded-[3.5rem] relative overflow-hidden group border-slate-200/40 min-w-[380px]">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 3v6h8V3h-8zm6 4h-4V5h4v2zM3 21h8v-6H3v6zm2-4h4v2H5v-2zM3 3v6h8V3H3zm6 4H5V5h4v2zm10 8h-6v8h6v-8zm-2 6h-2v-4h2v4z"/></svg>
        </div>
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-3">Efficiency Quotient</span>
            <span className="text-7xl font-black tracking-tighter text-[#0D9488] leading-none">
              {roundedScore}<span className="text-3xl text-slate-300 font-bold ml-1">%</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] block mb-3">Tier Assignment</span>
            <span className="text-[12px] font-black uppercase tracking-widest text-white bg-slate-900 px-6 py-2.5 rounded-2xl shadow-xl">
              {roundedScore < 20 ? "INITIATE" : roundedScore < 50 ? "QUALIFIED" : roundedScore < 85 ? "OPTIMIZED" : "ELITE_CLASS"}
            </span>
          </div>
        </div>
        
        <div className="h-4 w-full bg-slate-100/50 rounded-full overflow-hidden p-1 border border-slate-200/50 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-teal-600 via-teal-500 to-lime-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{ width: `${roundedScore}%` }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
