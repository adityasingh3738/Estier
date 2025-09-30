import React from 'react';

function Error({ statusCode }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      backgroundColor: '#0A0A0A',
      color: '#fff',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#7C4DFF' }}>
        {statusCode ? `Error ${statusCode}` : 'An error occurred'}
      </h1>
      <p style={{ fontSize: '1.2rem', textAlign: 'center' }}>
        {statusCode === 404 
          ? 'This page could not be found.' 
          : 'Something went wrong. Please try again later.'}
      </p>
      <button
        onClick={() => window.location.href = '/'}
        style={{ 
          marginTop: '2rem', 
          padding: '12px 24px', 
          backgroundColor: '#7C4DFF', 
          color: 'white', 
          textDecoration: 'none', 
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Go Home
      </button>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;


