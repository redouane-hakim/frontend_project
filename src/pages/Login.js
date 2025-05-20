import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.json())
      .then(data => {
        if(data.access) {
          login(data.access);
          onNavigate('posts');
        } else {
          setError('Invalid credentials');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <p>Don't have an account? <button onClick={() => onNavigate('register')}>Register</button></p>
    </div>
  );
}
