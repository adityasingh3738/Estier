import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaTimes } from 'react-icons/fa';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data } = await api.get(`/api/users/search?q=${searchQuery}`);
        setSearchResults(data.users);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleUserClick = (userId) => {
    router.push(`/profile/${userId}`);
    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center space-x-2 bg-mid-gray rounded-lg px-3 py-2">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          className="bg-transparent outline-none text-white w-48"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (searchQuery || searchResults.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-dark-gray border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-400">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => handleUserClick(user._id)}
                    className="w-full px-4 py-3 hover:bg-mid-gray transition-colors flex items-center space-x-3 text-left"
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full border-2 border-primary"
                    />
                    <div>
                      <p className="font-semibold text-white">@{user.username}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="p-4 text-center text-gray-400">No users found</div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

