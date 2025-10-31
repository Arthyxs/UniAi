import { NewsAPIArticle } from '../types';

const API_BASE_URL = 'https://newsapi.org/v2/top-headlines';

export const getNews = async (apiKey: string): Promise<NewsAPIArticle[]> => {
  if (!apiKey) {
    throw new Error('API Key is required.');
  }
  
  // Fetching top headlines for Brazil
  const url = `${API_BASE_URL}?country=br&pageSize=5&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Chave de API inválida.');
        }
      throw new Error('Falha ao buscar notícias.');
    }
    const data = await response.json();
    
    if (data.status === 'error') {
        throw new Error(data.message || 'Erro na API de notícias.');
    }

    return data.articles;
  } catch (error) {
    console.error("News service error:", error);
    throw error;
  }
};
