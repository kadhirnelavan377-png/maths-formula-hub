
import React, { useState, useEffect, useRef } from 'react';
import { MathExplanation, AppSettings } from './types.ts';
import { getMathExplanation } from './services/geminiService.ts';
import SettingsModal from './components/SettingsModal.tsx';

interface DashboardProps {
  userName: string;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, settings, onUpdateSettings }) => {
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState<MathExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const creatorRef = useRef<HTMLDivElement>(null);

  // Update CSS Variables based on theme
  useEffect(() => {
    const root = document.documentElement;
    const themeConfigs = {
      indigo: { start: '#6366f1', mid: '#a855f7', end: '#ec4899' },
      emerald: { start: '#10b981', mid: '#0ea5e9', end: '#3b82f6' },
      amber: { start: '#f59e0b', mid: '#f97316', end: '#ef4444' },
      cyan: { start: '#06b6d4', mid: '#0891b2', end: '#4f46e5' },
    };
    const config = themeConfigs[settings.theme];
    root.style.setProperty('--primary-start', config.start);
    root.style.setProperty('--primary-mid', config.mid);
    root.style.setProperty('--primary-end', config.end);
  }, [settings.theme]);

  // Close creator card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (creatorRef.current && !creatorRef.current.contains(event.target as Node)) {
        setShowCreator(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e?: React.FormEvent, searchTopic?: string) => {
    if (e) e.preventDefault();
    const topicToSearch = searchTopic || query;
    if (!topicToSearch.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await getMathExplanation(topicToSearch, settings);
      setExplanation(data);
      if (!history.includes(topicToSearch)) {
        setHistory(prev => [topicToSearch, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Could not fetch explanation. Please check your internet or try a different topic.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center">
      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
          settings={settings} 
          onUpdate={onUpdateSettings} 
          onClose={() => setShowSettings(false)} 
        />
      )}

      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center glass sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl math-gradient flex items-center justify-center shadow-lg">
            <i className="fas fa-infinity text-white"></i>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent math-gradient hidden sm:inline">Math Formula Hub</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Interactive Creator Button */}
          <div className="relative" ref={creatorRef}>
            <button 
              onClick={() => setShowCreator(!showCreator)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all shadow-lg border ${
                showCreator 
                  ? 'bg-indigo-500 border-indigo-400 text-white' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${showCreator ? 'bg-white/20' : 'math-gradient'}`}>
                <i className="fas fa-user-tie text-white"></i>
              </div>
              <span className="text-xs font-bold tracking-wide">Creator</span>
            </button>

            {/* Floating Creator Card */}
            {showCreator && (
              <div className="absolute top-full mt-3 right-0 w-64 glass rounded-3xl p-5 shadow-2xl border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl math-gradient flex items-center justify-center text-3xl text-white mb-4 shadow-xl">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">SR KADHIRNELAVAN</h4>
                  <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-3">Master Architect</p>
                  <div className="w-full h-px bg-white/10 mb-3"></div>
                  <p className="text-slate-400 text-xs italic">
                    Creator of <span className="text-white font-semibold">GeoCommand App</span>
                  </p>
                  <div className="mt-4 flex gap-2">
                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                       <i className="fab fa-github"></i>
                     </div>
                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                       <i className="fab fa-linkedin-in"></i>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500 transition-all flex items-center justify-center text-slate-300 hover:text-white"
            title="System Controls"
          >
            <i className="fas fa-cog"></i>
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <i className="fas fa-user text-slate-300"></i>
          </div>
        </div>
      </nav>

      {/* Hero Search Section */}
      <div className="w-full max-w-5xl px-6 pt-12 pb-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Master Any Formula</h2>
          <p className="text-slate-400 text-lg">Class {settings.gradeLevel} Logic • {settings.explanationDepth.toUpperCase()} Style</p>
        </div>

        <form onSubmit={handleSearch} className="relative group max-w-3xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search e.g., 'Trigonometry', 'Volume of a Cone' for Class ${settings.gradeLevel}...`}
            className="w-full px-8 py-5 rounded-2xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-lg shadow-2xl"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-2 bottom-2 px-6 rounded-xl math-gradient text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
          </button>
        </form>

        {history.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => { setQuery(h); handleSearch(undefined, h); }}
                className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs hover:border-indigo-500 hover:text-white transition-all"
              >
                {h}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <main className="w-full max-w-6xl px-6 pb-20">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center mb-6">
            <i className="fas fa-exclamation-circle mr-2"></i> {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
            <p className="text-indigo-400 animate-pulse font-medium">Gathering mathematical intelligence...</p>
          </div>
        )}

        {explanation && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Primary Card */}
            <div className="lg:col-span-8 space-y-6">
              <section className="glass rounded-3xl p-8 border-l-8 math-border">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-2 block">Formula Insight</span>
                    <h3 className="text-4xl font-extrabold text-white">{explanation.formulaName}</h3>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 self-start">
                    <code className="text-xl font-mono text-pink-400">{explanation.exactFormula}</code>
                  </div>
                </div>
                
                <div className="mt-8 space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                      <i className="fas fa-lightbulb text-yellow-400"></i> Intuitive Meaning
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-lg">{explanation.intuitiveMeaning}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/20">
                      <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-2">When to use</h4>
                      <p className="text-slate-300 text-sm">{explanation.whenToUse}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20">
                      <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2">When NOT to use</h4>
                      <p className="text-slate-300 text-sm">{explanation.whenNotToUse}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="glass rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                   <h4 className="text-xl font-bold text-white flex items-center gap-3">
                    <i className="fas fa-chalkboard-teacher text-indigo-400"></i> Solved Example
                  </h4>
                  {settings.enableVoice && (
                    <button className="w-10 h-10 rounded-full math-gradient text-white flex items-center justify-center hover:scale-110 transition-transform">
                      <i className="fas fa-play"></i>
                    </button>
                  )}
                </div>
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                  <ul className="space-y-4">
                    {explanation.solvedExample.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </span>
                        <p className="text-slate-300 pt-1">{step}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Final Result</span>
                    <span className="text-2xl font-black text-white px-4 py-2 rounded-xl math-gradient">{explanation.solvedExample.result}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar Cards */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass rounded-3xl p-6 border-t-4 border-t-red-500/50">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fas fa-bomb text-red-500"></i> The Trap
                </h4>
                <p className="text-slate-400 text-sm mb-3 font-medium italic">"{explanation.trapQuestion.question}"</p>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-300 text-xs leading-relaxed">{explanation.trapQuestion.explanation}</p>
                </div>
              </div>

              <div className="glass rounded-3xl p-6 border-t-4 border-t-yellow-500/50">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fas fa-triangle-exclamation text-yellow-500"></i> Common Mistake
                </h4>
                <p className="text-slate-300 text-sm bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  {explanation.commonMistake}
                </p>
              </div>

              <div className="glass rounded-3xl p-6 border-t-4 border-t-purple-500/50">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fas fa-brain text-purple-400"></i> Memory Hack
                </h4>
                <p className="text-slate-300 text-sm bg-purple-500/5 p-4 rounded-xl border border-purple-500/20">
                  {explanation.memoryTrick}
                </p>
              </div>

              <div className="glass rounded-3xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Related Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {explanation.relatedFormulas.map((formula, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setQuery(formula); handleSearch(undefined, formula); }}
                      className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs hover:border-indigo-500 hover:text-white transition-all"
                    >
                      {formula}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!explanation && !loading && !error && (
          <div className="py-20 flex flex-col items-center opacity-40">
            <i className="fas fa-magnifying-glass-chart text-8xl text-slate-800 mb-6"></i>
            <p className="text-slate-500 text-lg">Enter a math topic to begin your intuitive journey.</p>
          </div>
        )}
      </main>

      <footer className="mt-auto w-full py-10 glass border-t-0 text-center">
        <p className="text-slate-500 text-sm">
          &copy; 2024 Math Formula Hub. Personalized for Grade {settings.gradeLevel}.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
