import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CreatePost({ onPostCreated }) {
  const { token, profile,user } = useAuth();
  const [content, setContent] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProduct, setIsProduct] = useState(false);

  useEffect(() => {
    if (profile) {
      const info = profile.phone_number || user?.email;
      setContactInfo(info);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return alert('Post content is required');
    if (!speciality.trim()) return alert('Speciality is required');

    setLoading(true);

    const formData = new FormData();
    formData.append('content', content);
    formData.append('speciality', speciality);
    formData.append('contact_info', contactInfo);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (isProduct && price) {
      formData.append('price', price);
    }

    try {
      const res = await fetch('http://localhost:8000/api/posts/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert('Error: ' + (errorData.detail || 'Failed to create post'));
        setLoading(false);
        return;
      }

      const newPost = await res.json();
      onPostCreated(newPost);
      setContent('');
      setSpeciality('');
      setContactInfo('');
      setImageFile(null);
      setPrice('');
      setIsProduct(false);
    } catch (error) {
      alert('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#FAF3EF] border rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-[#5C2E0E] text-xl font-semibold mb-4">Create a {isProduct ? 'Product' : 'Post'}</h2>

      <input
        type="text"
        placeholder="Title / Object"
        value={speciality}
        onChange={(e) => setSpeciality(e.target.value)}
        required
        className="w-full mb-3 p-2 border border-[#D6BFAF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C2E0E]"
      />

      <textarea
        placeholder="Write your post content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
        className="w-full mb-3 p-2 border border-[#D6BFAF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C2E0E]"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="w-full mb-3 text-sm text-[#5C2E0E]"
      />

      <input
        type="text"
        placeholder="Contact Info"
        value={contactInfo}
        readOnly
        className="w-full mb-3 p-2 border border-[#E5E5E5] bg-gray-100 rounded-md text-gray-700 cursor-not-allowed"
      />

      <div className="flex items-center gap-6 mb-3">
        <label className="flex items-center gap-2 text-[#5C2E0E]">
          <input
            type="radio"
            name="postType"
            checked={!isProduct}
            onChange={() => setIsProduct(false)}
            className="accent-[#5C2E0E]"
          />
          Post
        </label>
        <label className="flex items-center gap-2 text-[#5C2E0E]">
          <input
            type="radio"
            name="postType"
            checked={isProduct}
            onChange={() => setIsProduct(true)}
            className="accent-[#5C2E0E]"
          />
          Product
        </label>
      </div>

      {isProduct && (
        <input
          type="number"
          placeholder="Price (MAD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-3 p-2 border border-[#D6BFAF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C2E0E]"
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-[#5C2E0E] text-white rounded-md hover:bg-[#4A2600] transition duration-200"
      >
        {loading ? 'Posting...' : 'Create Post'}
      </button>
    </form>
  );
}
