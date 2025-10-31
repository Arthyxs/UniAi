
import React, { useState, useEffect } from 'react';

interface ClockProps {
  isIdle?: boolean;
}

const Clock: React.FC<ClockProps> = ({ isIdle = false }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const day = date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  if (isIdle) {
    return (
      <div className="text-center text-white">
        <h1 className="text-8xl md:text-9xl font-thin tracking-tighter">{time}</h1>
        <p className="text-2xl md:text-3xl font-light opacity-80">{day}</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-black bg-opacity-10 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-center">
      <h1 className="text-6xl sm:text-7xl md:text-8xl font-thin tracking-tighter">{time}</h1>
      <p className="text-lg sm:text-xl font-light opacity-80">{day}</p>
    </div>
  );
};

export default Clock;
