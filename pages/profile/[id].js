import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuthStore } from '../../lib/store';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaEdit, FaSave, FaTimes, FaUserPlus, FaUserMinus } from 'react-icons/fa';

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [topRappers, setTopRappers] = useState(['', '', '', '', '']);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await api.get(`/api/users/${id}`);
      setUser(data.user);
      setPosts(data.posts);
      setTopRappers(
        data.user.topRappers.length > 0
          ? [...data.user.topRappers, ...Array(5 - data.user.topRappers.length).fill('')]
          : ['', '', '', '', '']
      );
      setFollowersCount(data.user.followers?.length || 0);
      setFollowingCount(data.user.following?.length || 0);
      
      // Check if current user is following this profile
      if (currentUser && data.user.followers) {
        setIsFollowing(data.user.followers.includes(currentUser.id));
      }
      
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const filteredRappers = topRappers.filter((rapper) => rapper.trim() !== '');

      await api.put(`/api/users/${id}`, {
        topRappers: filteredRappers,
      });

      toast.success('Profile updated!');
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleFollowToggle = async () => {
    try {
      const { data } = await api.post(`/api/users/${id}/follow`);
      setIsFollowing(data.isFollowing);
      setFollowersCount(data.followersCount);
      toast.success(data.isFollowing ? 'Following!' : 'Unfollowed');
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  const isOwnProfile = currentUser?.id === id;

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-20 text-gray-500">User not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start space-x-6">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full border-4 border-primary"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">@{user.username}</h1>
              <p className="text-gray-400 mb-4">{user.email}</p>

              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    {posts.length}
                  </span>
                  <p className="text-sm text-gray-400">Posts</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-primary">
                    {followersCount}
                  </span>
                  <p className="text-sm text-gray-400">Followers</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-primary">
                    {followingCount}
                  </span>
                  <p className="text-sm text-gray-400">Following</p>
                </div>
              </div>
            </div>

            <div>
              {isOwnProfile ? (
                !isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <FaSave />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )
              ) : currentUser ? (
                <button
                  onClick={handleFollowToggle}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                    isFollowing
                      ? 'bg-mid-gray text-gray-300 hover:bg-gray-700'
                      : 'bg-primary text-white hover:bg-purple-600'
                  }`}
                >
                  {isFollowing ? <FaUserMinus /> : <FaUserPlus />}
                  <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>

        {/* Top 5 Rappers */}
        <motion.div
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-4">Top 5 Favorite Rappers</h2>

          {isEditing ? (
            <div className="space-y-3">
              {topRappers.map((rapper, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-primary font-bold w-8">#{index + 1}</span>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={`Rapper ${index + 1}`}
                    value={rapper}
                    onChange={(e) => {
                      const newRappers = [...topRappers];
                      newRappers[index] = e.target.value;
                      setTopRappers(newRappers);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {user.topRappers && user.topRappers.length > 0 ? (
                user.topRappers.map((rapper, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-mid-gray rounded-lg"
                  >
                    <span className="text-primary font-bold text-xl w-8">
                      #{index + 1}
                    </span>
                    <span className="text-lg font-semibold">{rapper}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No favorite rappers added yet
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>

          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="card">
                  <p className="text-gray-300">{post.content}</p>
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{post.reactions?.length || 0} reactions</span>
                    <span>{post.comments?.length || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center text-gray-500 py-8">
              No posts yet
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
