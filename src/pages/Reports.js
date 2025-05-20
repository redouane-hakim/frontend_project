import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Reports({ onNavigate }) {
  const { token } = useAuth();
  const [bugDescription, setBugDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [message, setMessage] = useState(null);

  const submitBugReport = e => {
    e.preventDefault();
    fetch('http://localhost:8000/api/reports/bugs/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ description: bugDescription }),
    })
      .then(res => {
        if(!res.ok) throw new Error();
        setBugDescription('');
        setMessage('Bug report submitted');
      })
      .catch(() => setMessage('Failed to submit bug report'));
  };

  const submitUserReport = e => {
    e.preventDefault();
    fetch('http://localhost:8000/api/reports/users/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reported_user: userId, description: userDescription }),
    })
      .then(res => {
        if(!res.ok) throw new Error();
        setUserId('');
        setUserDescription('');
        setMessage('User report submitted');
      })
      .catch(() => setMessage('Failed to submit user report'));
  };

  return (
    <div>
      <h2>Report a Bug</h2>
      <form onSubmit={submitBugReport}>
        <textarea value={bugDescription} onChange={e => setBugDescription(e.target.value)} placeholder="Describe the bug" required />
        <button type="submit">Submit Bug Report</button>
      </form>

      <h2>Report a User</h2>
      <form onSubmit={submitUserReport}>
        <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID" required />
        <textarea value={userDescription} onChange={e => setUserDescription(e.target.value)} placeholder="Describe the issue" required />
        <button type="submit">Submit User Report</button>
      </form>

      {message && <p>{message}</p>}

      <button onClick={() => onNavigate('posts')}>Back to posts</button>
    </div>
  );
}
