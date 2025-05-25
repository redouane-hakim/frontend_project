import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
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
    <div className="min-h-screen flex items-center justify-center bg-[#FAF3EF] px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6 border border-[#e0cfc4]">
        <h2 className="text-2xl font-bold text-[#5C2E0E] mb-6 text-center">Login to Maroc Artisana</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#D6BFAF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C2E0E]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#D6BFAF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C2E0E]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5C2E0E] text-white py-2 rounded-md hover:bg-[#4A2600] transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && (
          <p className="text-red-600 mt-3 text-center font-medium">{error}</p>
        )}

        <p className="mt-4 text-center text-sm text-[#5C2E0E]">
          Don’t have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-[#8B4513] hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
