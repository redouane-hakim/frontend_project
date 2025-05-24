import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost'; // Add the create post form component

export default function Posts({ onNavigate }) {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialityFilter, setSpecialityFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('all'); // 'all' for posts, 'product' for products only

  // Debounce searchTerm updates to reduce API calls
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSpecialityFilter(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);

    let url = 'http://localhost:8000/api/posts/';
    if (specialityFilter) {
      url += `?speciality=${encodeURIComponent(specialityFilter)}`;
    }

    if (viewType === 'product') {
      url += `?price__isnull=false`;  // Only fetch products (posts with price)
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
  }, [token, specialityFilter, viewType]); // Include viewType in dependency array

  // Callback for when a post is created
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
      <div>
          <h2>Posts</h2>

          {/* Toggle buttons for filtering posts or products */}
          <button
              onClick={() => setViewType('all')}
              style={{marginRight: '10px'}}
          >
              Show All Posts
          </button>
          <button
              onClick={() => setViewType('product')}
          >
              Show Products Only
          </button>

          {/* Post creation form */}
          <CreatePost onPostCreated={handlePostCreated}/>

          <input
              type="search"
              placeholder="Filter by speciality"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{marginBottom: '10px', width: '200px'}}
              aria-label="Filter posts by speciality"
          />

          {loading && <p>Loading posts...</p>}
          {error && <p style={{color: 'red'}}>{error}</p>}

          <ul>
              {posts.map((post) => (
                  <li key={post.id} style={{marginBottom: '10px'}}>
                      <strong>
                          <button
                              style={{color: 'blue', border: 'none', background: 'none', cursor: 'pointer'}}
                              onClick={() => onNavigate('userProfile', {userId: post.author.id})} // Navigate to user profile page
                          >
                              {post.author.username} ({post.speciality || 'N/A'})
                          </button>
                      </strong>
                      : {post.content}{' '}
                      <p><strong>Contact: </strong>{post.author.profile.contact_info || 'N/A'}
                      </p>
                      <button onClick={() => onNavigate('postDetail', {postId: post.id})}>
                          View
                      </button>
                  </li>
              ))}
          </ul>
      </div>
  );
}
