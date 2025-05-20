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
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);

  useEffect(() => {
    if(profile) {
      setForm({
        image: null,
        location: profile.location || '',
        speciality: profile.speciality || '',
        phone_number: profile.phone_number || ''
      });
    }
  }, [profile]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    if(form.image) data.append('image', form.image);
    data.append('location', form.location);
    data.append('speciality', form.speciality);
    data.append('phone_number', form.phone_number);

    fetch('http://localhost:8000/api/users/profile/', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      })
      .then(updatedProfile => {
        setProfile(updatedProfile);
        alert('Profile updated');
        onNavigate('posts');
      })
      .catch(() => setError('Update failed'))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Profile Image: <input type="file" name="image" onChange={handleChange} /></label><br />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} /><br />
        <input name="speciality" placeholder="Speciality" value={form.speciality} onChange={handleChange} /><br />
        <input name="phone_number" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} /><br />
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  );
}
