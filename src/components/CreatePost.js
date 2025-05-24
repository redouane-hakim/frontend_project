import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CreatePost({ onPostCreated }) {
  const { token, profile } = useAuth(); // Assuming profile includes contact info
  const [content, setContent] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [contactInfo, setContactInfo] = useState(''); // This will hold the phone_number or email
  const [imageFile, setImageFile] = useState(null);
  const [price, setPrice] = useState('');  // Price for products
  const [loading, setLoading] = useState(false);
  const [isProduct, setIsProduct] = useState(false);  // State to toggle between Post and Product

  // Fetch contact info from profile (phone_number or email)
  useEffect(() => {
    if (profile) {
      const info = profile.phone_number || profile.email; // Fallback to email if phone_number is not available
      setContactInfo(info);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return alert('Post content is required');
    if (!speciality.trim()) return alert('Speciality is required');
    if (!contactInfo.trim()) return alert('Contact info is required');

    setLoading(true);

    const formData = new FormData();
    formData.append('content', content);
    formData.append('speciality', speciality);
    formData.append('contact_info', contactInfo); // Send the read-only contact info
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (isProduct && price) {
      formData.append('price', price); // Only for products
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
      setContactInfo(''); // Reset contact info
      setImageFile(null);
      setPrice('');
      setIsProduct(false); // Reset the toggle to 'Post' after submission
    } catch (error) {
      alert('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Object"
        value={speciality}
        onChange={(e) => setSpeciality(e.target.value)}
        required
        style={{ width: '100%', marginTop: '8px' }}
      />
      <textarea
        placeholder="Write your post content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
        style={{ width: '100%' }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        style={{ marginTop: '8px' }}
      />

      {/* Read-only contact info (phone_number or email) */}
      <input
        type="text"
        placeholder="Contact Info"
        value={contactInfo}
        readOnly
        style={{ width: '100%', marginTop: '8px', backgroundColor: '#f0f0f0' }}
      />

      {/* Toggle between Post and Product */}
      <div>
        <label>
          <input
            type="radio"
            name="postType"
            checked={!isProduct}
            onChange={() => setIsProduct(false)} // Set to Post
          />
          Post
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="radio"
            name="postType"
            checked={isProduct}
            onChange={() => setIsProduct(true)} // Set to Product
          />
          Product
        </label>
      </div>

      {/* Price field only for Product */}
      {isProduct && (
        <input
          type="number"
          placeholder="Price (only for products)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: '100%', marginTop: '8px' }}
        />
      )}

      <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
        {loading ? 'Posting...' : 'Create Post'}
      </button>
    </form>
  );
}
