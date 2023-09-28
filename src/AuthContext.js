import React, { createContext, useEffect, useState } from 'react';
import localforage from 'localforage';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AuthProvider: Checking localforage for login state');
    
    // Check if the user is logged in from localforage
    localforage.getItem('loggedIn').then((isLoggedIn) => {
      console.log('AuthProvider: Found loggedIn in localforage', isLoggedIn);
      if (isLoggedIn) {
        setLoggedIn(true);
      }
    });

    // Check if currentUser is in localforage
    localforage.getItem('currentUser').then((userData) => {
      console.log('AuthProvider: Found currentUser in localforage', userData);
      if (userData) {
        setCurrentUser(userData);
      }
    });
  }, []);

  const login = async ({ userData }) => {
    setIsLoading(true);
    
    try {
      console.log('AuthProvider: Logging in...');
      
      // Perform login logic here and fetch user data
      // Example: const user = await authenticateUser();
      setCurrentUser(userData);
      setLoggedIn(true);

      // Save the login state to localforage
      await localforage.setItem('loggedIn', true);
      await localforage.setItem('currentUser', userData);

      console.log('AuthProvider: Logged in successfully');
    } catch (error) {
      setError(error.message);
      console.error('AuthProvider: Error during login', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('AuthProvider: Logging out...');
    
    setCurrentUser({});
    setLoggedIn(false);

    // Remove the login state from localforage
    await localforage.removeItem('loggedIn');
    await localforage.removeItem('currentUser');

    console.log('AuthProvider: Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, currentUser, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
