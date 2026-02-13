import React, { useState } from 'react';
import { authService } from '../authService';

interface AuthPageProps {
  onAuthSuccess: (email: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);
    
    try {
      if (isLogin) {
        await authService.login(email, password);
        onAuthSuccess(email);
      } else {
        await authService.register(email, password);
        onAuthSuccess(email);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#F8FAFC]">
      <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-600"></div>
        
        <div className="flex justify-center mb-8">
           <div className="flex items-center gap-3 bg-teal-50 px-6 py-2 rounded-full border border-teal-100">
             <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest mono">Vault Encryption Active</span>
           </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">
            All<span className="text-teal-600">Ease</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[9px] mono">Secure Neural Workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 text-[11px] font-bold p-4 rounded-xl border border-red-100 text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Entity Identifier</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none text-slate-900 focus:border-teal-600 focus:bg-white transition-all text-sm font-semibold"
              placeholder="user@allease.io"
              disabled={isProcessing}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Neural Key</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none text-slate-900 focus:border-teal-600 focus:bg-white transition-all text-sm font-semibold"
              placeholder="••••••••"
              disabled={isProcessing}
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-4 bg-slate-900 hover:bg-teal-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center gap-4 ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isProcessing ? (
               <>
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 Processing...
               </>
            ) : (
              isLogin ? 'Grant Access' : 'Register Entity'
            )}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-slate-100 pt-8">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-widest transition-colors"
          >
            {isLogin ? "Generate New Profile" : "Return to Access Node"}
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
           <svg className="w-3 h-3 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
           <span className="text-[8px] text-slate-300 font-bold uppercase tracking-widest">End-to-End Local Encryption</span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;