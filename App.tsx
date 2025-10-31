import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useIdleTimer } from './hooks/useIdleTimer';
import { useSpeech } from './hooks/useSpeech';
import Clock from './components/Clock';
import WeatherWidget from './components/WeatherWidget';
import NewsWidget from './components/NewsWidget';
import MediaPlayer from './components/MediaPlayer';
import CalendarWidget from './components/CalendarWidget';
import AlarmsWidget from './components/AlarmsWidget';
import AssistantUI from './components/AssistantUI';
import { Alarm } from './types';
import Settings from './components/Settings';
import { SettingsIcon } from './components/icons';
import { useSettings } from './SettingsContext';

export default function App() {
  const { theme, themeClasses } = useTheme();
  const [isIdle, setIsIdle] = useState(false);
  const [isScreenOff, setScreenOff] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const { isReady: isSettingsReady } = useSettings();

  const handleIdle = () => setIsIdle(true);
  const handleScreenOff = () => {
    setScreenOff(true);
    if (window.electron) {
      window.electron.ipcRenderer.send('screen-control', 'off');
    }
  }
  const handleActive = () => {
    // Note: Waking up the screen is handled by OS/hardware events (mouse/keyboard).
    // The "wake-word" will also trigger this 'handleActive'.
    setIsIdle(false);
    setScreenOff(false);
  };

  useIdleTimer({ onIdle: handleIdle, onScreenOff: handleScreenOff, onActive: handleActive });
  
  const { isListening, transcript, startListening, stopListening, assistantResponse, isSpeaking, hasPermission } = useSpeech();
  
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: 1, time: '07:00', label: 'Morning Wakeup', enabled: true },
  ]);

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.time === currentTime) {
          console.log(`Alarm ringing: ${alarm.label}`);
          // In a real app, you would play a sound here.
          alert(`Alarm: ${alarm.label}`);
           // Prevent re-triggering within the same minute
          setAlarms(prev => prev.map(a => a.id === alarm.id ? {...a, enabled: false} : a));
        }
      });
    }, 1000 * 30); // Check every 30 seconds

    return () => clearInterval(checkAlarms);
  }, [alarms]);
  
  const wakeUp = () => {
    handleActive();
  };
  
  useEffect(() => {
    if (transcript.toLowerCase().includes('uni')) {
      wakeUp();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);


  const renderContent = () => {
    if (!isSettingsReady) {
      return <div className="flex items-center justify-center h-full"><p>Carregando...</p></div>;
    }

    if (isScreenOff) {
      // The screen is physically off, but we keep the app "running" invisibly.
      // We can render nothing or a black screen. A black screen is safer.
      return <div className="fixed inset-0 bg-black z-50" />;
    }

    if (isIdle) {
      return (
        <div className="flex items-center justify-center h-full animate-fade-in">
          <Clock isIdle={true} />
        </div>
      );
    }

    return (
      <main className="p-4 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 h-full w-full animate-fade-in">
        <div className="sm:col-span-2 lg:col-span-2">
          <Clock />
        </div>
        <WeatherWidget />
        <AlarmsWidget alarms={alarms} setAlarms={setAlarms} />
        <div className="sm:col-span-2 lg:col-span-4">
          <MediaPlayer />
        </div>
        <div className="sm:col-span-2 lg:col-span-2">
          <CalendarWidget />
        </div>
        <div className="sm:col-span-2 lg:col-span-2">
          <NewsWidget />
        </div>
      </main>
    );
  };
  
  return (
    <div className={`w-screen h-screen overflow-hidden font-sans transition-colors duration-1000 ${themeClasses}`}>
      {renderContent()}
      <AssistantUI 
        isListening={isListening} 
        isSpeaking={isSpeaking}
        assistantResponse={assistantResponse}
        transcript={transcript}
        hasPermission={hasPermission}
        startListening={startListening}
      />
      {!isIdle && !isScreenOff && (
        <div className="fixed bottom-6 right-6 z-30">
          <button onClick={() => setSettingsOpen(true)} className="p-3 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>
      )}
      <Settings isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
