
import React from 'react';
import { Alarm } from '../types';

interface AlarmsWidgetProps {
  alarms: Alarm[];
  setAlarms: React.Dispatch<React.SetStateAction<Alarm[]>>;
}

const AlarmsWidget: React.FC<AlarmsWidgetProps> = ({ alarms, setAlarms }) => {
  
  const toggleAlarm = (id: number) => {
    setAlarms(
      alarms.map(alarm =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };
  
  // Note: Adding a new alarm would require a modal or form,
  // which is omitted here for simplicity. This component focuses on display and toggling.

  return (
    <div className="bg-black bg-opacity-10 backdrop-blur-md rounded-3xl p-6 flex flex-col">
      <h2 className="text-xl font-medium opacity-80 mb-4">Alarmes</h2>
      <div className="space-y-3 overflow-y-auto">
        {alarms.map(alarm => (
          <div key={alarm.id} className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-light">{alarm.time}</p>
              <p className="text-sm opacity-70">{alarm.label}</p>
            </div>
            <button 
              onClick={() => toggleAlarm(alarm.id)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                alarm.enabled ? 'bg-blue-400' : 'bg-gray-500'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  alarm.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlarmsWidget;
