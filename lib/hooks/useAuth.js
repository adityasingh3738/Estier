import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store';

export function useRequireAuth() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  return user;
}

export function useAuth() {
  return useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    setAuth: state.setAuth,
    logout: state.logout,
  }));
}
