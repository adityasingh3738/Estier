import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '../lib/store';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { FaFire, FaUsers, FaMusic, FaTicketAlt } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const { user, setAuth } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  useEffect(() => {
    if (user) {
      router.push('/feed');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const { data } = await api.post(endpoint, formData);

      setAuth(data.user, data.token);
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      router.push('/feed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const features = [
    { icon: FaFire, title: 'Live Discussions', desc: 'Real-time chat for track premieres' },
    { icon: FaUsers, title: 'Community Polls', desc: 'Vote for your favorite tracks' },
    { icon: FaMusic, title: 'Artist Discovery', desc: 'Find emerging Desi Hip-Hop artists' },
    { icon: FaTicketAlt, title: 'Tickets & Merch', desc: 'Buy tickets with friends' },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-20 pb-16 text-center">
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={300}
              height={100}
              className="object-contain"
              priority
            />
          </motion.div>
          <motion.p
            className="text-xl md:text-2xl text-gray-400 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            The Ultimate Platform for Desi Hip-Hop Fans
          </motion.p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <feature.icon className="text-primary text-4xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Auth Form */}
          <motion.div
            className="max-w-md mx-auto bg-dark-gray border border-gray-800 rounded-2xl p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">
              {isLogin ? 'Login' : 'Sign Up'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Username"
                  className="input-field"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              <button type="submit" className="btn-primary w-full">
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-6 text-gray-400 text-sm">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
