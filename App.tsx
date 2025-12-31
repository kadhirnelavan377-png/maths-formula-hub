
import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { UserSession, AppSettings } from './types';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession>({
    name: '',
    isLoggedIn: false
  });

  const [settings, setSettings] = useState<AppSettings>({
    gradeLevel: 9,
    explanationDepth: 'simple',
    theme: 'indigo',
    enableThinking: true,
    enableVoice: false
  });

  const handleLogin = (name: string) => {
    setSession({ name, isLoggedIn: true });
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="min-h-screen">
      {!session.isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard 
          userName={session.name} 
          settings={settings} 
          onUpdateSettings={handleUpdateSettings} 
        />
      )}
    </div>
  );
};

export default App;
