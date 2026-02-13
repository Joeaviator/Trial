import React, { useState, useEffect } from 'react';
import { authService } from '../../authService';

interface DatabaseModuleProps {
  userId: string;
}

const DatabaseModule: React.FC<DatabaseModuleProps> = ({ userId }) => {
  const [query, setQuery] = useState('SELECT * FROM users');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    executeQuery();
  }, []);

  const executeQuery = () => {
    setError(null);
    // Pass the active userId to scope the query
    const res = authService.query(query, userId);
    if ((res as any).error) {
      setError((res as any).error);
      setResults([]);
    } else {
      setResults(res as any[]);
    }
  };

  return (
    <div className="space-y-12 fade-entry max-w-6xl mx-auto pb-32">
      <section className="bg-[#0F172A] p-12 md:p-16 rounded-[4rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <svg className="w-64 h-64 text-teal-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
        </div>

        <div className="flex items-center gap-6 mb-12">
          <div className="h-4 w-4 bg-teal-500 rounded-full animate-pulse"></div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Personal Data Vault</h2>
          <div className="h-[1px] flex-1 bg-slate-800"></div>
          <span className="mono text-[10px] text-teal-500 font-bold tracking-widest uppercase">Partition: {userId.split('@')[0]}</span>
        </div>

        <div className="bg-black/40 rounded-[2.5rem] border border-slate-800 p-8 mb-10 shadow-inner">
          <div className="flex flex-col sm:flex-row gap-6">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && executeQuery()}
              className="flex-1 bg-transparent border-none outline-none text-teal-400 mono text-xl font-bold placeholder:opacity-20"
              placeholder="ENTER SQL COMMAND..."
            />
            <button 
              onClick={executeQuery}
              className="bg-teal-600 hover:bg-teal-500 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-lg shadow-teal-500/20"
            >
              RUN QUERY
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mb-8 flex items-center gap-4">
            <span className="text-red-500">⚠️</span>
            <p className="text-red-400 mono text-xs font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
             <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Isolated Result View</span>
                <svg className="w-3 h-3 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
             </div>
             <div className="h-[1px] flex-1 mx-6 bg-slate-800/50"></div>
          </div>
          
          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-black/20">
            <table className="w-full text-left mono text-[11px]">
              <thead className="bg-slate-900/50 text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="px-8 py-6 uppercase tracking-widest">Index</th>
                  <th className="px-8 py-6 uppercase tracking-widest">Entity Signature</th>
                  <th className="px-8 py-6 uppercase tracking-widest">Vault Status</th>
                  <th className="px-8 py-6 uppercase tracking-widest text-right">Time Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {results.length > 0 ? results.map((row, idx) => (
                  <tr key={idx} className="hover:bg-teal-500/5 transition-colors group">
                    <td className="px-8 py-6 text-teal-500 font-bold">{idx + 1}</td>
                    <td className="px-8 py-6 text-slate-300">
                      <span className="group-hover:text-teal-400 transition-colors">
                        {row.email || row.event || "UNKNOWN_DOMAIN"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${row.status === 'ENCRYPTED' ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-teal-500/10 text-teal-400 border-teal-500/20'}`}>
                           {row.passwordHash ? 'AUTHORIZED_PARTITION' : row.status || 'SYSTEM_LOG'}
                         </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right text-slate-500 font-bold">
                      {new Date(row.timestamp || Date.now()).toLocaleTimeString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-600 uppercase tracking-[0.4em]">Partition Empty // No Active Handshake</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-teal-600 group-hover:w-2 transition-all"></div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Isolation Layer</h3>
          <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-6 uppercase tracking-wider">
            This tab is synchronized to session <span className="text-teal-600">"{userId}"</span>. To open a simultaneous session for a different user, simply open AllEase in a new tab.
          </p>
          <div className="flex items-center gap-4 text-teal-600 mono text-[9px] font-black uppercase tracking-widest">
            <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></span>
            Multi-User Conflict Protection: ACTIVE
          </div>
        </div>
        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-slate-900 group-hover:w-2 transition-all"></div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Terminal Presets</h3>
          <div className="flex flex-wrap gap-3">
            {['SELECT * FROM USERS', 'SELECT * FROM LOGS'].map(cmd => (
              <button 
                key={cmd}
                onClick={() => { setQuery(cmd); executeQuery(); }}
                className="px-6 py-3 rounded-xl bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-500 hover:border-teal-500 hover:text-teal-600 transition-all uppercase tracking-widest hover:shadow-lg"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseModule;