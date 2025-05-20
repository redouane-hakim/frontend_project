import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // Initialize token from localStorage for persistent login
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setProfile(null);
      return;
    }
    setLoadingUser(true);
    fetch('http://localhost:8000/api/users/me/', {
      method: 'GET',
      headers: { 'Authorization' : `Bearer ${token}`,
                 'Content-Type': 'application/json'
      },

    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user info');
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setProfile(data.profile);
      })
      .catch(() => {
        setToken(null);
        localStorage.removeItem('token');
        setUser(null);
        setProfile(null);
      })
      .finally(() => setLoadingUser(false));
  }, [token]);

  // Save token to localStorage and state
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Clear token from storage and state
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, profile, login, logout, loadingUser, setProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
