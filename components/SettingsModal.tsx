
import React from 'react';
import { AppSettings, ThemeType } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdate, onClose }) => {
  const themes: { name: ThemeType; colors: string[] }[] = [
    { name: 'indigo', colors: ['#6366f1', '#ec4899'] },
    { name: 'emerald', colors: ['#10b981', '#3b82f6'] },
    { name: 'amber', colors: ['#f59e0b', '#ef4444'] },
    { name: 'cyan', colors: ['#06b6d4', '#4f46e5'] },
  ];

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="glass w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl math-gradient flex items-center justify-center">
              <i className="fas fa-sliders text-white"></i>
            </div>
            <h2 className="text-2xl font-bold text-white">System Control</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <i className="fas fa-times text-slate-400"></i>
          </button>
        </div>

        <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Grade Level */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Academic Level</label>
              <span className="text-indigo-400 font-bold px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                Class {settings.gradeLevel}
              </span>
            </div>
            <input
              type="range"
              min="7"
              max="12"
              step="1"
              value={settings.gradeLevel}
              onChange={(e) => updateSetting('gradeLevel', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-bold px-1">
              <span>CLASS 7</span>
              <span>CLASS 12</span>
            </div>
          </section>

          {/* Explanation Style */}
          <section>
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Explanation Style</label>
            <div className="grid grid-cols-2 gap-3">
              {(['simple', 'comprehensive'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => updateSetting('explanationDepth', style)}
                  className={`py-3 px-4 rounded-2xl border transition-all flex items-center justify-center gap-2 font-semibold ${
                    settings.explanationDepth === style
                      ? 'math-gradient text-white border-transparent'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <i className={`fas ${style === 'simple' ? 'fa-bolt' : 'fa-book-open'}`}></i>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {/* Theme selection */}
          <section>
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Interface Theme</label>
            <div className="flex flex-wrap gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => updateSetting('theme', theme.name)}
                  className={`w-12 h-12 rounded-full border-2 transition-all p-1 ${
                    settings.theme === theme.name ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}
                />
              ))}
            </div>
          </section>

          {/* Toggles */}
          <section className="space-y-4">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <i className="fas fa-microchip text-purple-400 text-sm"></i>
                 </div>
                 <div>
                   <p className="text-sm font-bold text-white">AI Reasoning</p>
                   <p className="text-[10px] text-slate-500">Enable deep thinking for complex proofs</p>
                 </div>
               </div>
               <button
                onClick={() => updateSetting('enableThinking', !settings.enableThinking)}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.enableThinking ? 'bg-indigo-500' : 'bg-slate-700'}`}
               >
                 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.enableThinking ? 'left-7' : 'left-1'}`}></div>
               </button>
             </div>

             <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <i className="fas fa-volume-high text-pink-400 text-sm"></i>
                 </div>
                 <div>
                   <p className="text-sm font-bold text-white">Voice Guidance</p>
                   <p className="text-[10px] text-slate-500">Audible walkthrough of solved examples</p>
                 </div>
               </div>
               <button
                onClick={() => updateSetting('enableVoice', !settings.enableVoice)}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.enableVoice ? 'bg-indigo-500' : 'bg-slate-700'}`}
               >
                 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.enableVoice ? 'left-7' : 'left-1'}`}></div>
               </button>
             </div>
          </section>
        </div>

        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
