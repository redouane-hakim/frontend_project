import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Posts({ onNavigate }) {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialityFilter, setSpecialityFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce searchTerm updates to reduce API calls
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSpecialityFilter(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let url = 'http://localhost:8000/api/posts/';
    if (specialityFilter) {
      url += `?speciality=${encodeURIComponent(specialityFilter)}`;
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false));
  }, [token, specialityFilter]);

  return (
    <div>
      <h2>Posts</h2>
      <input
        type="search"
        placeholder="Filter by speciality"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px', width: '200px' }}
        aria-label="Filter posts by speciality"
      />

      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '10px' }}>
            <strong>
              {post.author.username} ({post.speciality || 'N/A'})
            </strong>
            : {post.content}{' '}
            <button onClick={() => onNavigate('postDetail', { postId: post.id })}>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
