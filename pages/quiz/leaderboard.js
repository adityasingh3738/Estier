import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaFire } from 'react-icons/fa';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function Leaderboard() {
  const router = useRouter();
  const [scope, setScope] = useState('global');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/daily-quiz/leaderboard?scope=${scope}`);
      setLeaderboard(data.leaderboard);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load leaderboard');
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-yellow-500 text-2xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-xl" />;
      case 3:
        return <FaMedal className="text-orange-600 text-xl" />;
      default:
        return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">🏆 Quiz Leaderboard</h1>
          <p className="text-gray-400">
            Compete with other Desi Hip-Hop fans and climb the rankings!
          </p>
        </div>

        {/* Scope Tabs */}
        <div className="flex space-x-2 mb-6 bg-mid-gray p-1 rounded-lg">
          <button
            onClick={() => setScope('global')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              scope === 'global'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Global
          </button>
          <button
            onClick={() => setScope('friends')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              scope === 'friends'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => setScope('city')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              scope === 'city'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            City
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 text-lg">
              No rankings yet. Be the first to take the quiz!
            </p>
            <button onClick={() => router.push('/quiz')} className="btn-primary mt-4">
              Take Quiz
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, idx) => (
              <motion.div
                key={entry.userId}
                className={`card flex items-center space-x-4 ${
                  entry.rank <= 3 ? 'border-2 border-primary/30' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <img
                  src={entry.avatar}
                  alt={entry.username}
                  className="w-12 h-12 rounded-full border-2 border-primary"
                />

                {/* User Info */}
                <div className="flex-1">
                  <p className="font-bold">@{entry.username}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Score: {entry.maxScore}</span>
                    <span>Quizzes: {entry.totalQuizzes}</span>
                    {entry.perfectCount > 0 && (
                      <span className="text-yellow-500">
                        ⭐ {entry.perfectCount} perfect
                      </span>
                    )}
                  </div>
                </div>

                {/* Streak */}
                {entry.currentStreak > 0 && (
                  <div className="flex items-center space-x-1 bg-orange-500/20 px-3 py-1 rounded-full">
                    <FaFire className="text-orange-500" />
                    <span className="font-bold">{entry.currentStreak}</span>
                  </div>
                )}

                {/* Total XP */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{entry.totalXP}</p>
                  <p className="text-xs text-gray-400">XP</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button onClick={() => router.push('/feed')} className="btn-secondary">
            Back to Feed
          </button>
        </div>
      </div>
    </Layout>
  );
}

