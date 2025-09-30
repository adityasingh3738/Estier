import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FaExternalLinkAlt } from 'react-icons/fa';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'release', 'drama', 'tour', 'interview', 'general'];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await api.get('/api/news');
      setNews(data.news);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load news');
      setLoading(false);
    }
  };

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter((item) => item.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      release: 'bg-green-500',
      drama: 'bg-red-500',
      tour: 'bg-blue-500',
      interview: 'bg-purple-500',
      general: 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Desi Hip-Hop News</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-mid-gray text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item, index) => (
            <motion.div
              key={item._id}
              className="card-hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Image */}
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-mid-gray">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.headline}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600">
                    <span className="text-4xl">📰</span>
                  </div>
                )}

                {/* Category Badge */}
                <span
                  className={`absolute top-2 right-2 ${getCategoryColor(
                    item.category
                  )} text-white text-xs font-semibold px-3 py-1 rounded-full`}
                >
                  {item.category}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.headline}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{item.summary}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(item.createdAt))} ago
                </span>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-purple-400 transition-colors"
                  >
                    <FaExternalLinkAlt />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No news articles found in this category.
          </div>
        )}
      </div>
    </Layout>
  );
}
