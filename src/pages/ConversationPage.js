import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ConversationPage({ conversationId, onNavigate }) {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages
  const loadMessages = () => {
    fetch(`http://localhost:8000/api/messaging/conversations/${conversationId}/messages/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load messages');
        return res.json();
      })
      .then((data) => setMessages(data))
      .catch(() => setError('Failed to load conversation'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  // Handle message send
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    fetch('http://localhost:8000/api/messaging/messages/create/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation: conversationId,
        content: newMessage,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to send message');
        return res.json();
      })
      .then(() => {
        setNewMessage('');
        loadMessages();
      })
      .catch(() => alert('Message send failed'));
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Conversation</h2>

      <div className="space-y-2 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.sender === user.id ? 'bg-green-100 text-right' : 'bg-gray-100'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <small className="text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleSendMessage}
          className="bg-[#5C2E0E] text-white px-4 py-2 rounded hover:bg-[#4A2600]"
        >
          Send
        </button>
      </div>

      <button
        onClick={() => onNavigate('messaging')}
        className="mt-4 text-sm underline text-blue-600"
      >
        ← Back to conversations
      </button>
    </div>
  );
}
