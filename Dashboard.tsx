
import React, { useState, useEffect, useRef } from 'react';
import { MathExplanation, AppSettings } from './types.ts';
import { getMathExplanation, getGradeSyllabus, GradeSyllabus } from './services/geminiService.ts';
import SettingsModal from './components/SettingsModal.tsx';

interface DashboardProps {
  userName: string;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, settings, onUpdateSettings }) => {
  const [explanation, setExplanation] = useState<MathExplanation | null>(null);
  const [syllabus, setSyllabus] = useState<GradeSyllabus | null>(null);
  const [loading, setLoading] = useState(false);
  const [syllabusLoading, setSyllabusLoading] = useState(false);
  const [error, setError] = useState('');
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

  // Fetch Syllabus when Grade Level changes
  useEffect(() => {
    const fetchSyllabus = async () => {
      setSyllabusLoading(true);
      setError('');
      try {
        const data = await getGradeSyllabus(settings.gradeLevel);
        setSyllabus(data);
        // Clear previous explanation when changing classes to show the new curriculum clearly
        setExplanation(null);
      } catch (err) {
        console.error("Failed to fetch syllabus", err);
        setError("Curriculum currently unavailable. Try another class.");
      } finally {
        setSyllabusLoading(false);
      }
    };
    fetchSyllabus();
  }, [settings.gradeLevel]);

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

  const handleSelectFormula = async (topic: string) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await getMathExplanation(topic, settings);
      setExplanation(data);
      // Smooth scroll to the explanation detail
      const element = document.getElementById('formula-detail');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      setError('Could not fetch explanation. Please check your internet or try a different topic.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const gradeOptions = [7, 8, 9, 10, 11, 12];

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

      {/* Class Selector Section */}
      <div className="w-full max-w-5xl px-6 pt-12 pb-8 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">Select Your Class</h2>
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {gradeOptions.map((grade) => (
            <button
              key={grade}
              onClick={() => onUpdateSettings({ ...settings, gradeLevel: grade })}
              className={`px-8 py-4 rounded-2xl text-lg font-bold transition-all border shadow-xl ${
                settings.gradeLevel === grade
                  ? 'math-gradient text-white border-transparent scale-110 ring-4 ring-indigo-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-indigo-500/50 hover:text-white'
              }`}
            >
              Class {grade}
            </button>
          ))}
        </div>

        {/* Syllabus Explorer Section */}
        <div className="w-full text-left">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl math-gradient flex items-center justify-center shadow-lg">
                <i className="fas fa-book-open text-white text-sm"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Class {settings.gradeLevel} Knowledge Hub</h3>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-1">Select a formula to master it</p>
              </div>
            </div>
            {syllabusLoading && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase">Syncing Curriculum...</span>
              </div>
            )}
          </div>

          {syllabusLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 rounded-[2rem] bg-slate-900/50 animate-pulse border border-slate-800"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {syllabus?.categories.map((category, idx) => (
                <div 
                  key={idx} 
                  className="glass rounded-[2rem] p-6 border-t-4 math-border animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full math-gradient"></span>
                    {category.name}
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    {category.formulas.map((formula, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handleSelectFormula(formula)}
                        className="text-left px-5 py-3.5 rounded-2xl bg-white/5 border border-white/5 text-slate-300 text-sm hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white transition-all group flex items-center justify-between gap-4 font-medium"
                      >
                        <span className="truncate">{formula}</span>
                        <i className="fas fa-arrow-right text-[10px] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-indigo-400"></i>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <main className="w-full max-w-6xl px-6 pb-20 mt-12">
        {error && (
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center mb-8 flex items-center justify-center gap-3">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-20">
            <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mb-8 shadow-2xl shadow-indigo-500/20"></div>
            <p className="text-indigo-400 animate-pulse font-bold text-lg tracking-tight">Extracting mathematical essence...</p>
          </div>
        )}

        {explanation && !loading && (
          <div id="formula-detail" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Primary Card */}
            <div className="lg:col-span-8 space-y-8">
              <section className="glass rounded-[2.5rem] p-10 border-l-8 math-border shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <i className="fas fa-atom text-8xl text-white"></i>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                  <div className="relative z-10">
                    <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-3 block">Class {settings.gradeLevel} Masterpiece</span>
                    <h3 className="text-5xl font-black text-white leading-tight">{explanation.formulaName}</h3>
                  </div>
                  <div className="px-6 py-4 rounded-[1.5rem] bg-slate-900 border border-slate-800 self-start shadow-inner relative z-10">
                    <code className="text-2xl font-mono text-pink-400">{explanation.exactFormula}</code>
                  </div>
                </div>
                
                <div className="space-y-10 relative z-10">
                  <div>
                    <h4 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <i className="fas fa-lightbulb text-yellow-400 text-sm"></i>
                      </div>
                      The Intuition
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-xl font-medium">{explanation.intuitiveMeaning}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 group hover:bg-emerald-500/10 transition-colors">
                      <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <i className="fas fa-check-circle"></i> Best Used When
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{explanation.whenToUse}</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20 group hover:bg-red-500/10 transition-colors">
                      <h4 className="text-xs font-black text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <i className="fas fa-times-circle"></i> Avoid If
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{explanation.whenNotToUse}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="glass rounded-[2.5rem] p-10 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                   <h4 className="text-2xl font-bold text-white flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                      <i className="fas fa-graduation-cap text-indigo-400"></i>
                    </div>
                    Step-by-Step Logic
                  </h4>
                  {settings.enableVoice && (
                    <button className="w-12 h-12 rounded-full math-gradient text-white flex items-center justify-center hover:scale-110 shadow-lg shadow-indigo-500/20 transition-transform">
                      <i className="fas fa-play"></i>
                    </button>
                  )}
                </div>
                <div className="bg-slate-950/50 rounded-[2rem] p-8 border border-slate-900 shadow-inner">
                  <ul className="space-y-6">
                    {explanation.solvedExample.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-6 group">
                        <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-sm group-hover:bg-indigo-500 group-hover:text-white transition-all">
                          {idx + 1}
                        </span>
                        <p className="text-slate-300 pt-2 text-lg leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-slate-500 font-black uppercase text-xs tracking-[0.3em]">Computed Result</span>
                    <span className="text-3xl font-black text-white px-8 py-4 rounded-2xl math-gradient shadow-2xl shadow-indigo-500/30 ring-4 ring-white/5">{explanation.solvedExample.result}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar Cards */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass rounded-[2rem] p-8 border-t-8 border-t-red-500 shadow-xl group hover:-translate-y-1 transition-transform">
                <h4 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                  <i className="fas fa-skull-crossbones text-red-500"></i> The Lethal Trap
                </h4>
                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-900 mb-5 italic text-slate-400 text-sm">
                  "{explanation.trapQuestion.question}"
                </div>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">{explanation.trapQuestion.explanation}</p>
              </div>

              <div className="glass rounded-[2rem] p-8 border-t-8 border-t-amber-500 shadow-xl group hover:-translate-y-1 transition-transform">
                <h4 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                  <i className="fas fa-hand-middle-finger text-amber-500 rotate-180 scale-x-[-1]"></i> Common Pitfall
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 font-medium">
                  {explanation.commonMistake}
                </p>
              </div>

              <div className="glass rounded-[2rem] p-8 border-t-8 border-t-purple-500 shadow-xl group hover:-translate-y-1 transition-transform">
                <h4 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                  <i className="fas fa-bolt-lightning text-purple-400"></i> Memory Shortcut
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 font-bold italic">
                  {explanation.memoryTrick}
                </p>
              </div>

              <div className="glass rounded-[2rem] p-8 shadow-xl">
                <h4 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                  <i className="fas fa-project-diagram text-indigo-400"></i> Neural Links
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {explanation.relatedFormulas.map((formula, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectFormula(formula)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold hover:border-indigo-500 hover:text-white transition-all hover:shadow-lg hover:shadow-indigo-500/10"
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
          <div className="py-20 flex flex-col items-center opacity-30 animate-pulse text-center">
            <i className="fas fa-compass-drafting text-9xl text-slate-800 mb-8"></i>
            <h3 className="text-2xl font-black text-slate-400 mb-2">Architecting Your Understanding</h3>
            <p className="text-slate-500 font-medium">Select a concept from the knowledge hub above to begin.</p>
          </div>
        )}
      </main>

      <footer className="mt-auto w-full py-16 glass border-t-0 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-500/5 opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl math-gradient flex items-center justify-center mb-6 shadow-xl">
            <i className="fas fa-infinity text-white text-lg"></i>
          </div>
          <p className="text-slate-500 text-sm font-bold tracking-widest uppercase mb-2">Math Formula Hub &bull; Grade {settings.gradeLevel} Edition</p>
          <p className="text-slate-600 text-xs font-medium">Empowering the next generation of logical thinkers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
