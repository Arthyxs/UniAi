
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'day' | 'night'>('day');

  useEffect(() => {
    const updateTheme = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 6 && currentHour < 19) {
        setTheme('day');
      } else {
        setTheme('night');
      }
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const themeClasses = theme === 'day'
    ? 'bg-gradient-to-br from-sky-100 to-blue-200 text-slate-800'
    : 'bg-gradient-to-br from-slate-900 to-indigo-900 text-gray-100';

  return { theme, themeClasses };
};
