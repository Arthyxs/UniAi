import React, { useState, useEffect } from 'react';
import { useSettings } from '../SettingsContext';
import { getWeather } from '../services/weatherService';
import { WeatherData } from '../types';
import { CloudIcon } from './icons';

const WeatherWidget: React.FC = () => {
  const { settings } = useSettings();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!settings.openWeatherApiKey || !settings.weatherCity) {
        setError('Configure a API e a cidade.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getWeather(settings.openWeatherApiKey, settings.weatherCity);
        setWeather(data);
      } catch (e: any) {
        setError(e.message || 'Erro ao buscar clima.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [settings.openWeatherApiKey, settings.weatherCity]);

  const renderContent = () => {
    if (loading) {
      return <p className="opacity-80">Carregando clima...</p>;
    }
    if (error) {
      return <p className="text-red-400">{error}</p>;
    }
    if (weather) {
      return (
        <>
          <h2 className="text-lg font-medium opacity-80 mb-2">{weather.city}</h2>
          <div className="flex items-center space-x-4">
            {weather.icon ? (
              <img 
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                alt={weather.description}
                className="w-16 h-16"
              />
            ) : (
              <CloudIcon className="w-16 h-16" />
            )}
            <p className="text-6xl font-thin">{weather.temperature}°</p>
          </div>
          <p className="mt-2 opacity-80 capitalize">{weather.description}</p>
          <div className="flex justify-around w-full mt-4 text-sm opacity-70">
            <p>Max: {weather.temp_max}°</p>
            <p>Min: {weather.temp_min}°</p>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="bg-black bg-opacity-10 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center">
      {renderContent()}
    </div>
  );
};

export default WeatherWidget;
