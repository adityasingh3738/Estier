import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DailyQuizCard from '../components/DailyQuizCard';
import { useAuthStore } from '../lib/store';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaFire, FaCrown, FaSkull, FaHeart, FaComment } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

export default function Feed() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/api/posts');
      setPosts(data.posts);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load posts');
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const { data } = await api.post('/api/posts', {
        content: newPost,
        isAnonymous,
      });

      setPosts([data.post, ...posts]);
      setNewPost('');
      toast.success('Post created!');
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      await api.post(`/api/posts/${postId}/react`, { reactionType });
      fetchPosts();
    } catch (error) {
      toast.error('Failed to react');
    }
  };

  const reactionIcons = {
    like: FaHeart,
    fire: FaFire,
    crown: FaCrown,
    skull: FaSkull,
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Community Feed</h1>

        {/* Daily Quiz Card */}
        <DailyQuizCard />

        {/* Create Post */}
        <motion.div
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              placeholder="What's on your mind?"
              className="input-field resize-none"
              rows="3"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-400">Post anonymously (Hot Take)</span>
              </label>
              <button type="submit" className="btn-primary">
                Post
              </button>
            </div>
          </form>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                <img
                  src={post.isAnonymous ? 'https://via.placeholder.com/40/7C4DFF/FFFFFF?text=?' : post.author?.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold">
                      {post.isAnonymous ? 'Anonymous' : `@${post.author?.username}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{post.content}</p>

                  <div className="flex items-center space-x-4">
                    {Object.entries(reactionIcons).map(([type, Icon]) => (
                      <button
                        key={type}
                        onClick={() => handleReaction(post._id, type)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-primary transition-colors"
                      >
                        <Icon />
                        <span className="text-sm">
                          {post.reactions?.filter((r) => r.type === type).length || 0}
                        </span>
                      </button>
                    ))}
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-primary transition-colors">
                      <FaComment />
                      <span className="text-sm">{post.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
