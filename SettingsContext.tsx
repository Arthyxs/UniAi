import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface Settings {
  openWeatherApiKey: string;
  newsApiKey: string;
  weatherCity: string;
}

interface SettingsContextType {
  settings: Settings;
  isReady: boolean;
  saveSettings: (newSettings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>({
    openWeatherApiKey: '',
    newsApiKey: '',
    weatherCity: 'São Paulo',
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('uni-settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    } finally {
      setIsReady(true);
    }
  }, []);

  const saveSettings = (newSettings: Settings) => {
    try {
      localStorage.setItem('uni-settings', JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // Relaunch the app to apply settings cleanly
      if (window.electron) {
        window.electron.ipcRenderer.send('relaunch-app');
      } else {
        window.location.reload();
      }

    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, isReady, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
