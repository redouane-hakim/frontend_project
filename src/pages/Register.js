import React, { useState } from 'react';

export default function Register({ onNavigate }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    fetch('http://localhost:8000/api/users/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Registration failed');
      })
      .then(() => setSuccess(true))
      .catch(() => setError('Could not register'))
      .finally(() => setLoading(false));
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF3EF] px-4">
        <div className="bg-white border border-[#e0cfc4] shadow-lg p-6 rounded-lg text-center max-w-md w-full">
          <p className="text-[#5C2E0E] text-lg mb-4">
            Registration successful!
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="px-4 py-2 bg-[#5C2E0E] text-white rounded-md hover:bg-[#4A2600] transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF3EF] px-4">
      <div className="bg-white border border-[#e0cfc4] shadow-lg p-6 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#5C2E0E] mb-6 text-center">Create Your Account</h2>

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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {error && (
          <p className="text-red-600 mt-3 text-center font-medium">{error}</p>
        )}

        <p className="mt-4 text-center text-sm text-[#5C2E0E]">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-[#8B4513] hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
