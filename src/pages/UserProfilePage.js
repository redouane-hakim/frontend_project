import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserProfilePage({ userId, onNavigate }) {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false); // Track subscription status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8000/api/users/${userId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setIsSubscribed(data.is_subscribed); // Assuming API returns this
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [userId, token]);

  // Handle subscribe/unsubscribe
  const handleSubscription = () => {
    setLoading(true);
    const url = isSubscribed
      ? `http://localhost:8000/api/users/subscribe/` // Unsubscribe
      : `http://localhost:8000/api/users/subscribe/`; // Subscribe

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subscribed_to: userId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to subscribe/unsubscribe');
        return res.json();
      })
      .then(() => {
        setIsSubscribed(!isSubscribed); // Toggle subscription status
      })
      .catch(() => alert('Failed to update subscription'))
      .finally(() => setLoading(false));
  };
const handleMessage = () => {
    fetch(`http://localhost:8000/api/messaging/buy-product/${userId}/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to start conversation');
        return res.json();
      })
      .then((data) => {
        if (data.conversation_id) {
          onNavigate('messaging'); // Navigate to messaging page
          alert('Conversation started with this user.');
        } else {
          alert('Failed to start a conversation');
        }
      })
      .catch(() => alert('Failed to start conversation'));
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return null;


  return (
      <div>
          <h2>{profile.username}'s Profile</h2>
          <div
              style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: profile.image ? 'transparent' : '#d3d3d3',  // Default grey if no image
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
              }}
          >
              {profile.image ? (
                  <img
                      src={`http://localhost:8000${profile.image}`} // The URL to the profile image
                      alt="Profile"
                      style={{width: '100%', height: '100%', objectFit: 'cover'}} // Ensure the image is circular
                  />
              ) : (
                  <span style={{color: '#fff', fontSize: '30px'}}>{profile.username[0]}</span> // Display the first letter of the username
              )}
          </div>
          <p>{profile.email}</p>
          <p>{profile.speciality || 'No speciality'}</p>
          <p>{profile.location}</p>
          <p>{profile.phone_number}</p>

          <button onClick={handleSubscription} disabled={loading}>
              {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </button>

          <button onClick={handleMessage} disabled={loading}>
              Message
          </button>

          <button onClick={() => onNavigate('posts')}>
              Back to Posts
          </button>
      </div>
  );
}
