import '../styles/globals.css';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../lib/store';
import { setAuthToken } from '../lib/api';

function MyApp({ Component, pageProps }) {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid #7C4DFF',
          },
        }}
      />
    </>
  );
}

export default MyApp;
