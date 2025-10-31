import { WeatherData } from '../types';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeather = async (apiKey: string, city: string): Promise<WeatherData> => {
  if (!apiKey || !city) {
    throw new Error('API Key and City are required.');
  }

  const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Chave de API inválida.');
      }
      throw new Error('Não foi possível encontrar a cidade.');
    }
    const data = await response.json();

    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0]?.description,
      icon: data.weather[0]?.icon,
      temp_max: Math.round(data.main.temp_max),
      temp_min: Math.round(data.main.temp_min),
    };
  } catch (error) {
    console.error("Weather service error:", error);
    throw error;
  }
};
