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
    <header
      style={{
        padding: '10px 20px',
        borderBottom: '1px solid #ddd',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
      }}
    >
      <nav>
        <button onClick={() => onNavigate('posts')}>Posts</button>
        <button onClick={() => onNavigate('profile')}>Profile</button>
        <button onClick={() => onNavigate('messaging')}>Messages</button>
        <button onClick={() => onNavigate('reports')}>Reports</button>
      </nav>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user && <span>Welcome, <strong>{user.username}</strong></span>}
        <button onClick={handleLogout} style={{ color: 'red' }}>
          Logout
        </button>
      </div>
    </header>
  );
}
