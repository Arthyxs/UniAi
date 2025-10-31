import { useEffect, useRef } from 'react';

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const SCREEN_OFF_TIMEOUT = 60 * 60 * 1000; // 1 hour

interface IdleTimerProps {
  onIdle: () => void;
  onScreenOff: () => void;
  onActive: () => void;
}

export const useIdleTimer = ({ onIdle, onScreenOff, onActive }: IdleTimerProps) => {
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const screenOffTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimers = () => {
    onActive();
    
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (screenOffTimer.current) clearTimeout(screenOffTimer.current);

    idleTimer.current = setTimeout(onIdle, IDLE_TIMEOUT);
    screenOffTimer.current = setTimeout(onScreenOff, SCREEN_OFF_TIMEOUT);
  };

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    
    // Also treat voice activation as an activity
    const wakeWordHandler = (event: CustomEvent) => {
      if (event.detail.transcript.toLowerCase().includes('uni')) {
        resetTimers();
      }
    };
    
    window.addEventListener('speechtranscript', wakeWordHandler as EventListener);
    events.forEach(event => window.addEventListener(event, resetTimers));
    resetTimers();

    return () => {
      window.removeEventListener('speechtranscript', wakeWordHandler as EventListener);
      events.forEach(event => window.removeEventListener(event, resetTimers));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (screenOffTimer.current) clearTimeout(screenOffTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onIdle, onScreenOff, onActive]);

  return null;
};
