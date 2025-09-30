import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaTrophy, FaFire, FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';
import api from '../lib/api';

export default function DailyQuizCard() {
  const router = useRouter();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyQuiz();
  }, []);

  const fetchDailyQuiz = async () => {
    try {
      const { data } = await api.get('/api/daily-quiz');
      setQuizData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching daily quiz:', error);
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (quizData && !quizData.hasCompleted) {
      router.push('/quiz');
    }
  };

  if (loading) {
    return (
      <div className="card mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-mid-gray rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-mid-gray rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!quizData) return null;

  return (
    <motion.div
      className="card mb-6 bg-gradient-to-r from-primary/10 to-purple-900/10 border-primary/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: quizData.hasCompleted ? 1 : 1.02 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <FaBrain className="text-primary text-2xl" />
            <h3 className="text-xl font-bold">Daily DHH Quiz</h3>
            {quizData.hasCompleted && (
              <FaCheckCircle className="text-green-500" />
            )}
          </div>

          <p className="text-gray-400 mb-4">
            {quizData.hasCompleted
              ? '🎉 You\'ve completed today\'s quiz! Come back tomorrow for more.'
              : 'Test your Desi Hip-Hop knowledge! 5 questions, 1-2 minutes.'}
          </p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <FaTrophy className="text-yellow-500" />
              <span>5 Questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaFire className="text-orange-500" />
              <span>Build Your Streak</span>
            </div>
          </div>
        </div>

        {!quizData.hasCompleted && (
          <button
            onClick={handleStartQuiz}
            className="btn-primary ml-4 whitespace-nowrap"
          >
            Start Quiz
          </button>
        )}
      </div>

      {quizData.hasCompleted && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button
            onClick={() => router.push('/quiz/leaderboard')}
            className="text-primary hover:underline text-sm font-semibold"
          >
            View Leaderboard →
          </button>
        </div>
      )}
    </motion.div>
  );
}

