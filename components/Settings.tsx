import React, { useState, useEffect } from 'react';
import { useSettings } from '../SettingsContext';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { settings, saveSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(localSettings);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-slate-800 text-white rounded-2xl p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6">Configurações</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="openWeatherApiKey" className="block text-sm font-medium text-gray-300 mb-1">
                OpenWeatherMap API Key
              </label>
              <input
                type="text"
                id="openWeatherApiKey"
                name="openWeatherApiKey"
                value={localSettings.openWeatherApiKey}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="weatherCity" className="block text-sm font-medium text-gray-300 mb-1">
                Cidade (Clima)
              </label>
              <input
                type="text"
                id="weatherCity"
                name="weatherCity"
                value={localSettings.weatherCity}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="newsApiKey" className="block text-sm font-medium text-gray-300 mb-1">
                NewsAPI Key
              </label>
              <input
                type="text"
                id="newsApiKey"
                name="newsApiKey"
                value={localSettings.newsApiKey}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
            >
              Salvar e Reiniciar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
