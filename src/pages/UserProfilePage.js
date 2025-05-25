import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserProfilePage({ userId, onNavigate }) {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReportBox, setShowReportBox] = useState(false);
  const [reportText, setReportText] = useState('');

   useEffect(() => {
    if (user?.id === userId) {
      onNavigate('profile');
    }
  }, [user, userId, onNavigate]);


  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8000/api/users/profile/${userId}/`, {
      headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setIsSubscribed(data.is_subscribed);
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [userId, token]);

  const handleSubscription = () => {
    setLoading(true);
    fetch(`http://localhost:8000/api/users/subscribe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subscribed_to: userId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setIsSubscribed(!isSubscribed);
      })
      .catch(() => alert('Failed to update subscription'))
      .finally(() => setLoading(false));
  };

const handleMessage = () => {
  fetch(`http://localhost:8000/api/messaging/start-conversation/${userId}/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to start conversation');
      return res.json();
    })
    .then((data) => {
      if (data.conversation_id) {
        alert(data.created ? 'Conversation started with this user.' : 'Opening existing conversation...');
        onNavigate('messaging');
      } else {
        alert('Failed to start a conversation');
      }
    })
    .catch(() => alert('Failed to start conversation'));
};


  const handleReportSubmit = () => {
    if (!reportText.trim()) return alert('Please describe the issue.');
    setLoading(true);
    fetch('http://localhost:8000/api/reports/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reported_user: userId,
        description: reportText,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        alert('Report submitted successfully.');
        setShowReportBox(false);
        setReportText('');
      })
      .catch(() => alert('Failed to submit report'))
      .finally(() => setLoading(false));
  };



  if (loading) return <p className="text-center text-[#5C2E0E]">Loading profile...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!profile) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white border border-[#e0cfc4] rounded-xl p-6 shadow">
      <h2 className="text-2xl font-bold text-[#5C2E0E] mb-4 text-center">
        {profile.username}'s Profile
      </h2>

      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center text-white text-3xl font-bold">
          {profile.image ? (
            <img
              src={`http://localhost:8000${profile.image}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{profile.username[0]}</span>
          )}
        </div>
      </div>

      <div className="text-[#5C2E0E] space-y-2 text-center">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Speciality:</strong> {profile.speciality || 'N/A'}</p>
        <p><strong>Location:</strong> {profile.location}</p>
        <p><strong>Phone:</strong> {profile.phone_number}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleSubscription}
          disabled={loading}
          className={`w-full py-2 rounded-md ${
            isSubscribed
              ? 'bg-red-100 text-red-800 hover:bg-red-200'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          } transition`}
        >
          {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>

        <button
          onClick={handleMessage}
          disabled={loading}
          className="w-full py-2 bg-[#5C2E0E] text-white rounded-md hover:bg-[#4A2600] transition"
        >
          Message
        </button>

        <button
          onClick={() => onNavigate('posts')}
          className="w-full py-2 border border-[#5C2E0E] text-[#5C2E0E] rounded-md hover:bg-[#FAF3EF] transition"
        >
          Back to Posts
        </button>

         <button
        className="mt-4 text-red-600 underline"
        onClick={() => setShowReportBox(!showReportBox)}
      >
        Report this user
      </button>

      {showReportBox && (
        <div className="mt-4 p-4 border border-gray-300 bg-red-50 rounded">
          <textarea
            placeholder="Describe the issue (e.g., scam, harassment)"
            className="w-full p-2 border border-red-300 rounded"
            rows={4}
            value={reportText}
            onChange={e => setReportText(e.target.value)}
          ></textarea>
          <button
            onClick={handleReportSubmit}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
