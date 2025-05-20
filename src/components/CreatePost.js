import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CreatePost({ onPostCreated }) {
  const { token } = useAuth();
  const [content, setContent] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return alert('Post content is required');
    if (!speciality.trim()) return alert('Speciality is required');
    if (!contactInfo.trim()) return alert('Contact info is required');

    setLoading(true);

    const formData = new FormData();
    formData.append('content', content);
    formData.append('speciality', speciality);
    formData.append('contact_info', contactInfo);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await fetch('http://localhost:8000/api/posts/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: Do NOT set Content-Type header when using FormData; browser sets it automatically
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
      setContent('');
      setSpeciality('');
      setContactInfo('');
      setImageFile(null);
      onPostCreated(newPost);
      alert('Post created successfully');
    } catch (error) {
      alert('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <textarea
        placeholder="Write your post content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
        style={{ width: '100%' }}
      />
      <input
        type="text"
        placeholder="Speciality"
        value={speciality}
        onChange={(e) => setSpeciality(e.target.value)}
        required
        style={{ width: '100%', marginTop: '8px' }}
      />
      <input
        type="text"
        placeholder="Contact Info"
        value={contactInfo}
        onChange={(e) => setContactInfo(e.target.value)}
        required
        style={{ width: '100%', marginTop: '8px' }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        style={{ marginTop: '8px' }}
      />
      <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
        {loading ? 'Posting...' : 'Create Post'}
      </button>
    </form>
  );
}
