
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-slate-950 overflow-hidden px-4">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 blur-[120px] rounded-full"></div>
      
      {/* Floating Math Symbols */}
      <div className="absolute top-20 left-10 text-6xl text-slate-800 floating stagger-1 select-none font-serif opacity-40">Σ</div>
      <div className="absolute bottom-40 left-20 text-4xl text-slate-800 floating stagger-2 select-none font-serif opacity-30">π</div>
      <div className="absolute top-1/4 right-20 text-7xl text-slate-800 floating select-none font-serif opacity-40">√</div>
      <div className="absolute bottom-20 right-1/4 text-5xl text-slate-800 floating stagger-1 select-none font-serif opacity-30">∆</div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-3xl math-gradient mb-6 shadow-xl shadow-indigo-500/20">
            <i className="fas fa-brain text-4xl text-white"></i>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Math Formula Hub</h1>
          <p className="text-slate-400 font-medium">Your personal formula intelligence system</p>
        </div>

        <div className="glass p-10 rounded-[2rem] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">What's your name, Scholar?</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-6 py-4 rounded-2xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl math-gradient text-white font-bold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
            >
              Start Exploring <i className="fas fa-arrow-right"></i>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-slate-500 text-sm">
              Helping students master mathematics through intuition, not memorization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
