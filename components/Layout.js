import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuthStore } from '../lib/store';
import { FaHome, FaPoll, FaNewspaper, FaShoppingBag, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import UserSearch from './UserSearch';

export default function Layout({ children }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { name: 'Feed', path: '/feed', icon: FaHome },
    { name: 'Polls', path: '/polls', icon: FaPoll },
    { name: 'News', path: '/news', icon: FaNewspaper },
    { name: 'Marketplace', path: '/marketplace', icon: FaShoppingBag },
    { name: 'Profile', path: user ? `/profile/${user.id}` : '/profile', icon: FaUser },
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-dark-gray border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/feed">
              <motion.div
                className="cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span
                    className={`flex items-center space-x-2 ${
                      router.pathname === item.path ? 'nav-link-active' : 'nav-link'
                    }`}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </span>
                </Link>
              ))}
            </nav>

            {user && (
              <div className="flex items-center space-x-4">
                <UserSearch />
                <span className="text-sm text-gray-400">@{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaSignOutAlt size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-gray border-t border-gray-800 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex flex-col items-center space-y-1 ${
                  router.pathname === item.path ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <item.icon size={20} />
                <span className="text-xs">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
