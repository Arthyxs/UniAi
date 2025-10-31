
import React from 'react';
import { CalendarEvent } from '../types';

const mockEvents: CalendarEvent[] = [
  { id: '1', time: '10:00', title: 'Reunião de equipe', calendar: 'Work' },
  { id: '2', time: '12:30', title: 'Almoço com cliente', calendar: 'Work' },
  { id: '3', time: '18:00', title: 'Consulta médica', calendar: 'Personal' },
  { id: '4', time: '20:00', title: 'Jantar em família', calendar: 'Personal' },
];

const CalendarWidget: React.FC = () => {
  return (
    <div className="h-full bg-black bg-opacity-10 backdrop-blur-md rounded-3xl p-6 flex flex-col">
      <h2 className="text-xl font-medium opacity-80 mb-4">Sua Agenda</h2>
      <div className="space-y-4 overflow-y-auto">
        {mockEvents.map(event => (
          <div key={event.id} className="flex items-center">
            <div className={`w-1.5 h-10 rounded-full mr-4 ${event.calendar === 'Work' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
            <div>
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm opacity-70">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;
