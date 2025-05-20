import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Messaging({ onNavigate }) {
  const { token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/api/messaging/conversations/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setConversations(data))
      .catch(() => alert('Failed to load conversations'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <h2>Conversations</h2>
      {loading ? <p>Loading...</p> :
        conversations.length === 0 ? <p>No conversations.</p> :
        <ul>
          {conversations.map(conv => (
            <li key={conv.id}>
              Participants: {conv.participants.map(p => p.username).join(', ')}
            </li>
          ))}
        </ul>
      }
      <button onClick={() => onNavigate('posts')}>Back to posts</button>
    </div>
  );
}
