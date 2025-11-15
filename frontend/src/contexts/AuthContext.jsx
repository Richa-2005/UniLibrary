import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; //gives the base url and token

// this is exported to get the authentication of user's identity 
const AuthContext = createContext(null);


// This is a component that *provides* the context's value
// to all children wrapped inside it.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // For initial check

  useEffect(() => {
    if (token) {
      // If we have a token, let's verify it with the server
      api.get('/admin/me')
        .then(response => {
          // Token is valid, Set the user
          setUser({ name: response.data.name, email: response.data.adminEmail });
        })
        .catch(() => {
          // Token is invalid (expired, etc.)
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false); // No token, stop loading
    }
  }, [token]);

  // Login function
  const login = async (email, password) => {

    // This will hit http://localhost:5000/api/login-admin
    const response = await api.post('/admin/login', { adminEmail: email, password });
    
    // Save token and user
    const { token, universityName } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser({ name: universityName, email });
    return response.data; // Return data for any redirects
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // The value our context will provide to the app
  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user, // A simple boolean to check if logged in
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// This lets components easily access the context's value
export const useAuth = () => {
  return useContext(AuthContext);
};