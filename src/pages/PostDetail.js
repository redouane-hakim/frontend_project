import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PostDetail({ postId, onNavigate }) {
  const { token } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = () => {
    setLoadingPost(true);
    setError(null);
    fetch(`http://localhost:8000/api/posts/${postId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load post');
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setComments(data.comments || []);
      })
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoadingPost(false));
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  // Add comment handler
  const addComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    setLoadingComment(true);
    fetch(`http://localhost:8000/api/posts/${postId}/comment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: commentText }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Comment failed');
        return res.json();
      })
      .then((newComment) => {
        setComments((prev) => [...prev, newComment]);
        setCommentText('');
      })
      .catch(() => alert('Failed to add comment'))
      .finally(() => setLoadingComment(false));
  };

  // Toggle like handler with XOR logic
  const toggleLike = (value) => {
    setLoadingLike(true);
    fetch(`http://localhost:8000/api/posts/${postId}/like/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ value }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update like');
        return res.json();
      })
      .then(() => fetchPost())
      .catch(() => alert('Failed to update like'))
      .finally(() => setLoadingLike(false));
  };

  // Handle Buy Product — start messaging conversation and navigate
  const handleBuyProduct = () => {
    if (!post || !post.id) return;
    fetch(`http://localhost:8000/api/messaging/buy-product/${post.id}/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to initiate conversation');
        return res.json();
      })
      .then((data) => {
        // Assuming backend returns { conversation_id }
        if (data.conversation_id) {
          onNavigate('messaging');
          alert('Conversation started with product owner. Check your messages.');
        } else {
          alert('Conversation started.');
          onNavigate('messaging');
        }
      })
      .catch(() => alert('Failed to start conversation'));
  };

  if (loadingPost) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return null;

  return (
    <div>
      <h3>
        Post by {post.author.username} ({post.speciality || 'N/A'})
      </h3>
      <p>{post.content}</p>
      <p>Contact Info: {post.contact_info}</p>

      {post.price !== undefined && (
        <p>
          <strong>Price:</strong> ${post.price.toFixed(2)}
        </p>
      )}

      <p>Likes: {post.likes_count}</p>

      <button
        onClick={() => toggleLike(1)}
        disabled={loadingLike}
        aria-label="Like post"
      >
        👍
      </button>
      <button
        onClick={() => toggleLike(-1)}
        disabled={loadingLike}
        aria-label="Dislike post"
      >
        👎
      </button>

      {post.price !== undefined && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleBuyProduct} disabled={loadingLike}>
            Buy Product
          </button>
        </div>
      )}

      <h4>Comments</h4>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <b>{c.author.username}</b>: {c.text}
          </li>
        ))}
      </ul>

      <form onSubmit={addComment}>
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment"
          disabled={loadingComment}
          required
          aria-label="Add comment"
        />
        <button type="submit" disabled={loadingComment}>
          {loadingComment ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <button style={{ marginTop: '10px' }} onClick={() => onNavigate('posts')}>
        Back to Posts
      </button>
    </div>
  );
}
