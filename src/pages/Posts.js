import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import ReportPostModel from '../components/ReportPostModel';

export default function Posts({ onNavigate }) {
  const { token,user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialityFilter, setSpecialityFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('all');
  const [reportingPostId, setReportingPostId] = useState(null);// 'all' or 'product'

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
      url += `${specialityFilter ? '&' : '?'}price__isnull=false`;
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
  }, [token, specialityFilter, viewType]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-[#5C2E0E] mb-4">Maroc Artisana Posts</h2>
 {/* View Toggle Buttons */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setViewType('all')}
          className={`px-4 py-2 rounded-md border transition ${
            viewType === 'all'
              ? 'bg-[#5C2E0E] text-white'
              : 'bg-white text-[#5C2E0E] border-[#5C2E0E]'
          }`}
        >
          Show All Posts
        </button>
        <button
          onClick={() => setViewType('product')}
          className={`px-4 py-2 rounded-md border transition ${
            viewType === 'product'
              ? 'bg-[#5C2E0E] text-white'
              : 'bg-white text-[#5C2E0E] border-[#5C2E0E]'
          }`}
        >
          Show Products Only
        </button>
      </div>
      {/* Create Post Form */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Search Bar */}
      <input
        type="search"
        placeholder="Filter by speciality"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-6 px-4 py-2 border border-[#D6BFAF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C2E0E]"
      />

      {/* Loading/Error States */}
      {loading && <p className="text-center text-[#5C2E0E]">Loading posts...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Posts List */}
      <ul className="space-y-6">
        {posts
          .filter((post) => viewType === 'all' || post.price != null)
          .map((post) =>(
            <li
                key={post.id}
                className="p-4 border border-[#E0CFC4] rounded-lg bg-[#FFF8F2] shadow-sm"
            >
                <strong className="text-[#5C2E0E] text-lg block mb-1">
                    <button
                        className="hover:underline text-blue-700"
                        onClick={() => onNavigate('UserProfilePage', {userId: post.author.id})}
                    >
                        {post.author.username} ({post.speciality || 'N/A'})
                    </button>
                </strong>

                <p className="text-sm text-[#4A2600] mb-1">{post.content}</p>

                <p className="text-sm text-gray-600 mb-2">
                    <strong>Contact:</strong>{' '}
                    {post?.contact_info || 'N/A'}
                </p>

                {post.type === 'product' && (
                <p className="text-sm text-gray-600 mb-2">
                    <strong>Contact:</strong>{' '}
                    {post.price || 'N/A'}
                </p>)}

                <button
                    onClick={() => onNavigate('postDetail', {postId: post.id})}
                    className="mt-2 px-4 py-1 bg-[#5C2E0E] text-white rounded hover:bg-[#4A2600] transition"
                >
                    View
                </button>

                {token && post.author.id !== user?.id && (
                <button
                    onClick={() => setReportingPostId(post.id)}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Report
                </button>
                )}

            </li>
        ))}
      </ul>
      {reportingPostId && (
      <ReportPostModel
        postId={reportingPostId}
        onClose={() => setReportingPostId(null)}
        onReported={() => alert('Report submitted successfully.')}
        token={token}
      />
      )}

    </div>);
}
