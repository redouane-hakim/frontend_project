import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, fallback }) {
  const { token, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF3EF]">
        <div className="text-[#5C2E0E] text-lg font-medium animate-pulse">
          Loading user info...
        </div>
      </div>
    );
  }

  if (!token) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF3EF]">
        <div className="text-center text-[#5C2E0E] text-lg font-semibold border border-[#5C2E0E] px-6 py-4 rounded-md">
          Please login first.
        </div>
      </div>
    );
  }

  return children;
}
