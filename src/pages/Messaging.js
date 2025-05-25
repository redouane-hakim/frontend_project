import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Messaging({ onNavigate }) {
  const { token, user } = useAuth();
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
    <div className="min-h-screen bg-[#FAF3EF] px-4 py-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded-xl border border-[#e0cfc4] shadow">
        <h2 className="text-2xl font-semibold text-[#5C2E0E] mb-6 text-center">
          Conversations
        </h2>

        {loading ? (
          <p className="text-center text-[#5C2E0E]">Loading...</p>
        ) : conversations.length === 0 ? (
          <p className="text-center text-[#5C2E0E]">No conversations found.</p>
        ) : (
          <ul className="space-y-4">
            {conversations.map((conv) => (
              <li
                key={conv.id}
                onClick={() => onNavigate('conversation', { conversationId: conv.id })}
                className="cursor-pointer p-4 bg-[#FFF8F2] border border-[#E6D6C6] rounded-lg shadow-sm hover:bg-[#f2e3d4] transition"
              >
                <p className="text-[#5C2E0E] font-medium">
                  Participants:{' '}
                  <span className="text-sm">
                    {conv.participants
                      .filter(p => p.id !== user?.id)
                      .map((p) => p.username)
                      .join(', ') || 'You'}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('posts')}
            className="px-4 py-2 bg-[#5C2E0E] text-white rounded-md hover:bg-[#4A2600] transition"
          >
            Back to Posts
          </button>
        </div>
      </div>
    </div>
  );
}
