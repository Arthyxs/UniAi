import React, { useState, useEffect } from 'react';
import { useSettings } from '../SettingsContext';
import { getNews } from '../services/newsService';
import { NewsAPIArticle } from '../types';

// Helper to format time since publication
const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return "há " + Math.floor(interval) + " d";
    interval = seconds / 3600;
    if (interval > 1) return "há " + Math.floor(interval) + " h";
    interval = seconds / 60;
    if (interval > 1) return "há " + Math.floor(interval) + " min";
    return "agora";
};


const NewsWidget: React.FC = () => {
    const { settings } = useSettings();
    const [articles, setArticles] = useState<NewsAPIArticle[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            if (!settings.newsApiKey) {
                setError('Configure a API de notícias.');
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const data = await getNews(settings.newsApiKey);
                setArticles(data);
            } catch (e: any) {
                setError(e.message || 'Erro ao buscar notícias.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
        // Refresh news every hour
        const interval = setInterval(fetchNews, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [settings.newsApiKey]);


    const renderContent = () => {
        if (loading) {
            return <p className="opacity-80">Carregando notícias...</p>;
        }
        if (error) {
            return <p className="text-red-400 text-center">{error}</p>;
        }
        if (articles.length > 0) {
            return (
                <div className="space-y-4 overflow-y-auto">
                    {articles.map((article, index) => (
                    <div key={index}>
                        <p className="font-semibold leading-tight">{article.title}</p>
                        <p className="text-sm opacity-70">{article.source.name} · {timeSince(new Date(article.publishedAt))}</p>
                    </div>
                    ))}
                </div>
            );
        }
        return <p className="opacity-70 text-center">Nenhuma notícia encontrada.</p>;
    }

  return (
    <div className="h-full bg-black bg-opacity-10 backdrop-blur-md rounded-3xl p-6 flex flex-col">
      <h2 className="text-xl font-medium opacity-80 mb-4">Últimas Notícias</h2>
      {renderContent()}
    </div>
  );
};

export default NewsWidget;
