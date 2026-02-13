
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        authService.login(email, password);
        onAuthSuccess(email);
      } else {
        authService.register(email, password);
        onAuthSuccess(email);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-600"></div>
        
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">
            All<span className="text-teal-600">Ease</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mono">Professional Workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 text-[11px] font-bold p-4 rounded-xl border border-red-100 text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none text-slate-900 focus:border-teal-600 focus:bg-white transition-all text-sm font-semibold"
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Key</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none text-slate-900 focus:border-teal-600 focus:bg-white transition-all text-sm font-semibold"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 hover:bg-teal-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-300 active:scale-95 shadow-md"
          >
            {isLogin ? 'Access System' : 'Create Profile'}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-slate-100 pt-8">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-widest transition-colors"
          >
            {isLogin ? "Request New Account" : "Return to Access"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
