import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, fallback }) {
  const { token, loadingUser } = useAuth();

  if (loadingUser) return <div>Loading user info...</div>;
  if (!token) return fallback || <div>Please login first.</div>;

  return children;
}
