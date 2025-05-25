import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onNavigate }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      onNavigate('login');
    }
  };

  return (
    <header className="bg-[#FAF3EF] border-b border-[#e0cfc4] shadow-sm px-4 py-3 flex flex-wrap items-center justify-between">
      {/* Left Navigation */}
      <nav className="flex gap-4 text-[#5C2E0E] font-medium">
        <button
          onClick={() => onNavigate('posts')}
          className="hover:text-[#8B4513] transition-colors"
        >
          Posts
        </button>
        <button
          onClick={() => onNavigate('profile')}
          className="hover:text-[#8B4513] transition-colors"
        >
          Profile
        </button>
        <button
          onClick={() => onNavigate('messaging')}
          className="hover:text-[#8B4513] transition-colors"
        >
          Messages
        </button>
        <button
          onClick={() => onNavigate('reports')}
          className="hover:text-[#8B4513] transition-colors"
        >
          Reports
        </button>
      </nav>

      {/* Right User Info & Logout */}
      <div className="flex items-center gap-3 text-[#5C2E0E] mt-2 sm:mt-0">
        {user && (
          <span className="text-sm sm:text-base">
            Welcome, <strong>{user.username}</strong>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 transition-colors text-sm sm:text-base"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
