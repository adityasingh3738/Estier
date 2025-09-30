import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuthStore } from '../lib/store';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaTrophy, FaFire } from 'react-icons/fa';

export default function Polls() {
  const { user } = useAuthStore();
  const [polls, setPolls] = useState([]);
  const [artists, setArtists] = useState([]);
  const [emergingArtists, setEmergingArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pollsRes, artistsRes, emergingRes] = await Promise.all([
        api.get('/api/polls'),
        api.get('/api/artists?type=hot'),
        api.get('/api/artists?type=emerging'),
      ]);

      setPolls(pollsRes.data.polls);
      setArtists(artistsRes.data.artists);
      setEmergingArtists(emergingRes.data.artists);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const handleVote = async (pollId, songIndex) => {
    try {
      await api.post(`/api/polls/${pollId}/vote`, { songIndex });
      fetchData();
      toast.success('Vote recorded!');
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const getTotalVotes = (poll) => {
    return poll.songs.reduce((sum, song) => sum + song.votes.length, 0);
  };

  const getVotePercentage = (song, totalVotes) => {
    if (totalVotes === 0) return 0;
    return ((song.votes.length / totalVotes) * 100).toFixed(1);
  };

  const hasUserVoted = (poll) => {
    return poll.songs.some((song) => song.votes.includes(user?.id));
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
        <h1 className="text-3xl font-bold mb-8">Polls & Discovery</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Polls Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Active Polls</h2>
            {polls.map((poll, index) => {
              const totalVotes = getTotalVotes(poll);
              const userVoted = hasUserVoted(poll);

              return (
                <motion.div
                  key={poll._id}
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-bold mb-2">{poll.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{poll.description}</p>
                  <p className="text-xs text-gray-500 mb-4">Total votes: {totalVotes}</p>

                  <div className="space-y-3">
                    {poll.songs.map((song, songIndex) => {
                      const percentage = getVotePercentage(song, totalVotes);
                      const isVoted = song.votes.includes(user?.id);

                      return (
                        <div key={songIndex} className="relative">
                          <button
                            onClick={() => handleVote(poll._id, songIndex)}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                              isVoted
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                            disabled={userVoted && !isVoted}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <div className="font-semibold">{song.title}</div>
                                <div className="text-sm text-gray-400">{song.artist}</div>
                              </div>
                              <div className="text-lg font-bold text-primary">
                                {percentage}%
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-mid-gray rounded-full h-2 overflow-hidden">
                              <motion.div
                                className="bg-primary h-2"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hot Artists Leaderboard */}
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <FaTrophy className="text-yellow-500 text-2xl" />
                <h3 className="text-xl font-bold">Top 10 Hot Artists</h3>
              </div>

              <div className="space-y-3">
                {artists.slice(0, 10).map((artist, index) => (
                  <div
                    key={artist._id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-mid-gray transition-colors"
                  >
                    <span className="text-lg font-bold text-primary w-6">#{index + 1}</span>
                    <img
                      src={artist.image || 'https://via.placeholder.com/40/7C4DFF/FFFFFF?text=A'}
                      alt={artist.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{artist.name}</div>
                      <div className="text-xs text-gray-400">Score: {artist.hotScore}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Emerging Artists */}
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <FaFire className="text-orange-500 text-2xl" />
                <h3 className="text-xl font-bold">Emerging Artists</h3>
              </div>

              <div className="space-y-3">
                {emergingArtists.map((artist) => (
                  <div
                    key={artist._id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-mid-gray transition-colors cursor-pointer"
                  >
                    <img
                      src={artist.image || 'https://via.placeholder.com/40/7C4DFF/FFFFFF?text=A'}
                      alt={artist.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{artist.name}</div>
                      <div className="text-xs text-gray-400 line-clamp-1">{artist.bio}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
