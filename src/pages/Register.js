import React, { useState } from 'react';

export default function Register({ onNavigate }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const [success,setSuccess] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    fetch('http://localhost:8000/api/users/register/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, email, password}),
    })
    .then(res => {
      if(res.ok) return res.json();
      else throw new Error('Registration failed');
    })
    .then(() => setSuccess(true))
    .catch(() => setError('Could not register'))
    .finally(() => setLoading(false));
  };

  if(success) return (
    <div>
      <p>Registration successful! You can now <button onClick={() => onNavigate('login')}>Login</button>.</p>
    </div>
  );

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <p>Have an account? <button onClick={() => onNavigate('login')}>Login</button></p>
    </div>
  );
}
