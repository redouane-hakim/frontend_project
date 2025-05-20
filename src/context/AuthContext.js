import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refresh_token'));
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  // Refresh access token using refresh token
  const refreshAccessToken = async () => {
    if (!refreshToken) return false;
    try {
      const res = await fetch('http://localhost:8000/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!res.ok) throw new Error('Refresh token invalid');
      const data = await res.json();
      localStorage.setItem('token', data.access);
      setToken(data.access);
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  // Fetch user info, try refresh if access token expired
  const fetchUserInfo = async (currentToken) => {
    setLoadingUser(true);
    try {
      let res = await fetch('http://localhost:8000/api/users/me/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        // Try refresh token if access expired
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          res = await fetch('http://localhost:8000/api/users/me/', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
        } else {
          throw new Error('Token expired');
        }
      }

      if (!res.ok) throw new Error('Failed to fetch user info');

      const data = await res.json();
      setUser(data.user);
      setProfile(data.profile);
    } catch {
      logout();
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoadingUser(false);
      return;
    }
    fetchUserInfo(token);
  }, [token]);

  // Save tokens to localStorage and state on login
  const login = (accessToken, refreshTokenValue) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refresh_token', refreshTokenValue);
    setToken(accessToken);
    setRefreshToken(refreshTokenValue);
  };

  // Clear tokens and user info on logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        user,
        profile,
        login,
        logout,
        loadingUser,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
