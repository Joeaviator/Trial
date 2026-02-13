
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await authService.login(email, password);
      } else {
        await authService.register(email, password);
      }
      onAuthSuccess(email);
    } catch (err: any) {
      console.error("Supabase Auth Error:", err);
      // Clean up common Supabase error messages for the UI
      let message = err.message || "Credential verification failed.";
      if (message.includes("Database error")) message = "Critical: Database connection failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#F8FAFC]">
      {/* Dynamic Security Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0D9488 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-md w-full relative">
        <div className="glass-premium p-12 md:p-16 rounded-[4rem] border border-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-teal-500 via-teal-600 to-slate-900"></div>
          
          <div className="text-center mb-14">
            <h1 className="text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-none">
              All<span className="text-teal-600">Ease</span>
            </h1>
            <div className="inline-flex items-center gap-3 bg-slate-900 px-8 py-3 rounded-full shadow-2xl border border-slate-800">
              <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(45,212,191,0.6)]"></span>
              <p className="text-white font-black uppercase tracking-[0.5em] text-[11px] mono">Authentication Portal</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 text-red-700 text-[12px] font-black p-6 rounded-3xl border border-red-100 text-center animate-in fade-in slide-in-from-top-4">
                <span className="block uppercase tracking-[0.2em] mb-2 opacity-50">Identity Verification Failed</span>
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-6">User Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 px-10 py-6 rounded-[2rem] outline-none text-slate-900 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 transition-all text-sm font-semibold shadow-inner"
                placeholder="identity@allease.ai"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-6">Access Key</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 px-10 py-6 rounded-[2rem] outline-none text-slate-900 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 transition-all text-sm font-semibold shadow-inner"
                placeholder="••••••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-7 bg-slate-900 overflow-hidden text-white font-black uppercase tracking-[0.6em] text-[13px] rounded-[2.5rem] transition-all duration-500 active:scale-95 shadow-2xl disabled:bg-slate-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 flex items-center justify-center gap-4">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                    Establishing Session...
                  </>
                ) : isLogin ? 'Authorize Entry' : 'Create Profile'}
              </span>
            </button>
          </form>

          <div className="mt-16 text-center pt-12 border-t border-slate-100">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-[11px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-[0.3em] transition-all flex items-center gap-4 mx-auto group"
            >
              <span className="w-3 h-0.5 bg-slate-200 group-hover:bg-teal-600 transition-all"></span>
              {isLogin ? "Request New Account" : "Access Identity Console"}
              <span className="w-3 h-0.5 bg-slate-200 group-hover:bg-teal-600 transition-all"></span>
            </button>
          </div>
        </div>
        
        <p className="mt-14 text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.7em] mono opacity-50">
          Encrypted Connection • Secure-Build v3.0.1
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
