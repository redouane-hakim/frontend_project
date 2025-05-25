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

  if (loadingPost) return <p className="text-center text-[#5C2E0E]">Loading post...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-[#e0cfc4] rounded-xl shadow mt-6">
      <h3 className="text-xl font-bold text-[#5C2E0E] mb-2">
        Post by {post.author.username} <span className="text-sm font-normal">({post.speciality || 'N/A'})</span>
      </h3>
      <p className="mb-2 text-[#5C2E0E]">{post.content}</p>
      <p className="text-sm mb-2 text-gray-700">
        <strong>Contact Info:</strong> {post.contact_info}
      </p>

      {post.type === 'product' && (
        <p className="mb-2 text-[#5C2E0E]">
          <strong>Price:</strong> ${Number(post.price).toFixed(2)} MAD
        </p>
      )}

      <p className="mb-3 text-sm text-gray-600">Likes: {post.likes_count}</p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => toggleLike(1)}
          disabled={loadingLike}
          className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
        >
          👍
        </button>
        <button
          onClick={() => toggleLike(-1)}
          disabled={loadingLike}
          className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
        >
          👎
        </button>
      </div>

      {post.type === 'product' && (
        <div className="mb-4">
          <button
            onClick={handleBuyProduct}
            disabled={loadingLike}
            className="px-4 py-2 bg-[#5C2E0E] text-white rounded hover:bg-[#4A2600] transition"
          >
            Buy Product
          </button>
        </div>
      )}

      <h4 className="text-lg font-semibold text-[#5C2E0E] mt-6 mb-2">Comments</h4>
      <ul className="mb-4 space-y-2">
        {comments.map((c) => (
          <li key={c.id} className="bg-[#FAF3EF] p-3 rounded-md border text-[#5C2E0E]">
            <b>{c.author.username}</b>: {c.text}
          </li>
        ))}
      </ul>

      <form onSubmit={addComment} className="space-y-3">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment"
          disabled={loadingComment}
          required
          className="w-full p-2 border border-[#D6BFAF] rounded focus:outline-none focus:ring-2 focus:ring-[#5C2E0E]"
        />
        <button
          type="submit"
          disabled={loadingComment}
          className="w-full py-2 bg-[#5C2E0E] text-white rounded hover:bg-[#4A2600] transition"
        >
          {loadingComment ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => onNavigate('posts')}
          className="px-4 py-2 text-[#5C2E0E] border border-[#5C2E0E] rounded hover:bg-[#FAF3EF] transition"
        >
          Back to Posts
        </button>
      </div>
    </div>
  );
}
