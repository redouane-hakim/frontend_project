import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile({ onNavigate }) {
  const { token, profile, setProfile } = useAuth();
  const [form, setForm] = useState({
    image: null,
    location: '',
    speciality: '',
    phone_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) {
      setForm({
        image: null,
        location: profile.location || '',
        speciality: profile.speciality || '',
        phone_number: profile.phone_number || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    if (form.image) data.append('image', form.image);
    data.append('location', form.location);
    data.append('speciality', form.speciality);
    data.append('phone_number', form.phone_number);

    fetch('http://localhost:8000/api/users/profile/', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      })
      .then((updatedProfile) => {
        setProfile(updatedProfile);
        alert('Profile updated');
        onNavigate('posts');
      })
      .catch(() => setError('Update failed'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#FAF3EF] flex justify-center items-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg border border-[#e0cfc4]">
        <h2 className="text-xl font-semibold text-[#5C2E0E] mb-5 text-center">
          Edit Your Profile
        </h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="block text-[#5C2E0E] font-medium mb-1">Profile Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full text-sm"
            />
          </div>

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#D6BFAF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C2E0E]"
          />
          <input
            name="speciality"
            placeholder="Speciality"
            value={form.speciality}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#D6BFAF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C2E0E]"
          />
          <input
            name="phone_number"
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#D6BFAF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C2E0E]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5C2E0E] text-white py-2 rounded-md hover:bg-[#4A2600] transition"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-center mt-4 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}
