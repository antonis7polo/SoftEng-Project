import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');

  const router = useRouter();

  const checkAndSetLogoutTimer = () => {
    const tokenData = localStorage.getItem('tokenData');
    if (tokenData) {
      const { token, timestamp} = JSON.parse(tokenData);
      const oneHour = 3600000; 
      const currentTime = new Date().getTime();

      if (currentTime - timestamp < oneHour) {
        setIsLoggedIn(!!token);

        const timeLeft = oneHour - (currentTime - timestamp);
        const logoutTimer = setTimeout(() => {
          localStorage.removeItem('tokenData');
          setIsLoggedIn(false);
          router.push('/');
          setSessionExpiredMessage('Your session has expired. Please log in again.');
        }, timeLeft);

        return () => clearTimeout(logoutTimer);
      } else {
        localStorage.removeItem('tokenData');
        setIsLoggedIn(false);
        router.push('/');
        setSessionExpiredMessage('Your session has expired. Please log in again.');
      }
    }
  };

  useEffect(() => {
    checkAndSetLogoutTimer();
  }, [router.asPath]);

  const saveToken = (token, userID) => {
    const timestamp = new Date().getTime();
    localStorage.setItem('tokenData', JSON.stringify({ token, timestamp, userID }));
    console.log(userID)
    setIsLoggedIn(true);
    setSessionExpiredMessage(''); // Reset the message when a new token is saved
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, saveToken, sessionExpiredMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
