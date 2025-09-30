import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTimes } from 'react-icons/fa';
import api from '../lib/api';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function Quiz() {
  const router = useRouter();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (!results && quizData && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !results) {
      handleNextQuestion();
    }
  }, [timeLeft, results, quizData]);

  const fetchQuiz = async () => {
    try {
      const { data } = await api.get('/api/daily-quiz');
      
      if (data.hasCompleted) {
        toast.error('You have already completed today\'s quiz!');
        router.push('/feed');
        return;
      }

      setQuizData(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load quiz');
      router.push('/feed');
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: {
        answer,
        timeSpent: 60 - timeLeft,
      },
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(60);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post(`/api/daily-quiz/${quizData.quizId}/submit`, {
        answers,
      });

      setResults(data);

      // Show confetti for perfect score
      if (data.isPerfect) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      toast.success(`Quiz completed! Score: ${data.score}/${data.totalQuestions * 10}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
      router.push('/feed');
    } finally {
      setSubmitting(false);
    }
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

  if (results) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="card text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h1 className="text-4xl font-bold mb-6">
              {results.isPerfect ? '🎉 Perfect Score!' : '✅ Quiz Complete!'}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-mid-gray p-4 rounded-lg">
                <p className="text-3xl font-bold text-primary">{results.score}</p>
                <p className="text-sm text-gray-400">Total Points</p>
              </div>
              <div className="bg-mid-gray p-4 rounded-lg">
                <p className="text-3xl font-bold text-green-500">
                  {results.correctCount}/{results.totalQuestions}
                </p>
                <p className="text-sm text-gray-400">Correct</p>
              </div>
              <div className="bg-mid-gray p-4 rounded-lg">
                <p className="text-3xl font-bold text-orange-500">{results.streak}</p>
                <p className="text-sm text-gray-400">Day Streak</p>
              </div>
              <div className="bg-mid-gray p-4 rounded-lg">
                <p className="text-3xl font-bold text-yellow-500">{results.totalXP}</p>
                <p className="text-sm text-gray-400">Total XP</p>
              </div>
            </div>

            {results.newBadges && results.newBadges.length > 0 && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-500 font-semibold mb-2">🏆 New Badges Earned!</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {results.newBadges.map((badge) => (
                    <span key={badge} className="px-3 py-1 bg-yellow-500/20 rounded-full text-sm">
                      {badge.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6 text-left">
              <h2 className="text-2xl font-bold">Review Answers</h2>
              {results.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border ${
                    q.isCorrect
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {q.isCorrect ? (
                      <FaCheckCircle className="text-green-500 mt-1" />
                    ) : (
                      <FaTimes className="text-red-500 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold mb-1">Q{idx + 1}: {q.prompt}</p>
                      {!q.isCorrect && (
                        <p className="text-sm text-red-400">
                          Your answer: {q.userAnswer || 'No answer'}
                        </p>
                      )}
                      <p className="text-sm text-green-400">
                        Correct answer: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' or ') : q.correctAnswer}
                      </p>
                      {q.explanation && (
                        <p className="text-sm text-gray-400 mt-1">{q.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={() => router.push('/feed')} className="btn-secondary">
                Back to Feed
              </button>
              <button onClick={() => router.push('/quiz/leaderboard')} className="btn-primary">
                View Leaderboard
              </button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </span>
            <div className="flex items-center space-x-2">
              <FaClock className="text-primary" />
              <span className={timeLeft < 10 ? 'text-red-500' : 'text-gray-400'}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <div className="w-full bg-mid-gray rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            className="card"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold flex-1">{question.prompt}</h2>
              {question.isBonus && (
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                  BONUS
                </span>
              )}
            </div>

            <div className="space-y-3">
              {question.type === 'mcq' && question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(question.id, option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[question.id]?.answer === option
                      ? 'border-primary bg-primary/20'
                      : 'border-gray-700 hover:border-primary/50'
                  }`}
                >
                  {option}
                </button>
              ))}

              {question.type === 'true_false' && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAnswer(question.id, 'True')}
                    className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                      answers[question.id]?.answer === 'True'
                        ? 'border-primary bg-primary/20'
                        : 'border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    ✓ True
                  </button>
                  <button
                    onClick={() => handleAnswer(question.id, 'False')}
                    className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                      answers[question.id]?.answer === 'False'
                        ? 'border-primary bg-primary/20'
                        : 'border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    ✗ False
                  </button>
                </div>
              )}

              {question.type === 'short_answer' && (
                <input
                  type="text"
                  placeholder="Type your answer..."
                  className="input-field"
                  value={answers[question.id]?.answer || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                />
              )}
            </div>

            <button
              onClick={handleNextQuestion}
              className="btn-primary w-full mt-6"
              disabled={!answers[question.id]}
            >
              {currentQuestion < quizData.questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
}

