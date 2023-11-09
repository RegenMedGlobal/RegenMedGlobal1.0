import React, { createContext, useEffect, useState } from 'react';
import localforage from 'localforage';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
   const [authorLoggedIn, setAuthorLoggedIn] = useState(false); // New authorLoggedIn state
  const [currentAuthorUser, setCurrentAuthorUser] = useState({});
   const [currentAuthorName, setCurrentAuthorName] = useState(''); 
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

    // Check if the author is logged in from localforage
    localforage.getItem('authorLoggedIn').then((isAuthorLoggedIn) => {
      console.log('AuthProvider: Found authorLoggedIn in localforage', isAuthorLoggedIn);
      if (isAuthorLoggedIn) {
        setAuthorLoggedIn(true);
      }
    });

    // Check if currentAuthorUser is in localforage
    localforage.getItem('currentAuthorUser').then((authorData) => {
      console.log('AuthProvider: Found currentAuthorUser in localforage', authorData);
      if (authorData) {
        setCurrentAuthorUser(authorData);
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

   const authorLogin = async ({ authorUserData }) => {
  setIsLoading(true);

  try {
    console.log('AuthProvider: Logging in as an author...');

    // Perform author login logic here and fetch author data
    // Example: const author = await authenticateAuthor();
    setCurrentAuthorUser(authorUserData); // Use authorData directly
   // setCurrentAuthorName(authorData); // Use authorName directly
    setAuthorLoggedIn(true);

    // Save the author login state to localforage
    await localforage.setItem('authorLoggedIn', true);
    await localforage.setItem('currentAuthorUser', authorUserData);

    console.log('AuthProvider: Logged in as an author successfully');
    console.log("author logged in from context: ", authorLoggedIn)
    console.log("author current name: ", currentAuthorName)
  } catch (error) {
    setError(error.message);
    console.error('AuthProvider: Error during author login', error);
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

    const authorLogout = async () => {
    console.log('AuthProvider: Logging out as an author...');

    setCurrentAuthorUser({});
    setAuthorLoggedIn(false);
    // Remove the author login state from localforage
    await localforage.removeItem('authorLoggedIn');
    await localforage.removeItem('currentAuthorUser');

    console.log('AuthProvider: Logged out as an author successfully');
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, authorLogout, authorLogin, authorLoggedIn, currentAuthorUser, currentUser, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
