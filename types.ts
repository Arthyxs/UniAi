export interface Alarm {
  id: number;
  time: string;
  label: string;
  enabled: boolean;
}

export interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  calendar: 'Personal' | 'Work';
}

export interface NewsArticle {
  id: string;
  source: string;
  headline: string;
  time: string;
}

// Interfaces for real API data
export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  temp_max: number;
  temp_min: number;
}

export interface NewsAPIArticle {
  source: {
    name: string;
  };
  title: string;
  publishedAt: string;
}
