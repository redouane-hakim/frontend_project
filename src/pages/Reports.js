import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function MyReportsPage() {
  const { token } = useAuth();
  const [reports, setReports] = useState({
    post_reports: [],
    user_reports: [],
    bug_reports: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBugForm, setShowBugForm] = useState(false);
  const [bugDescription, setBugDescription] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/api/reports/my-reports/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load reports');
        return res.json();
      })
      .then((data) => setReports(data))
      .catch(() => setError('Could not fetch reports'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleBugSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/reports/bugs/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description: bugDescription }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Bug report failed');
        return res.json();
      })
      .then(() => {
        alert('Bug reported');
        setBugDescription('');
        setShowBugForm(false);
      })
      .catch(() => alert('Failed to submit bug report'));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded mt-4">
      <div className="text-center mt-6">
        <button
          onClick={() => setShowBugForm((prev) => !prev)}
          className="bg-[#5C2E0E] text-white px-4 py-2 rounded"
        >
          {showBugForm ? 'Hide Bug Form' : 'Report a Bug'}
        </button>
      </div>

      {showBugForm && (
        <form onSubmit={handleBugSubmit} className="mt-4">
          <textarea
            className="w-full border rounded p-2"
            placeholder="Describe the bug..."
            value={bugDescription}
            onChange={(e) => setBugDescription(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Bug Report
          </button>
        </form>
      )}
      <h2 className="text-2xl font-bold mb-4 text-[#5C2E0E] text-center">My Reports</h2>

      {loading && <p>Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-[#5C2E0E]">Post Reports</h3>
        <ul className="list-disc ml-6">
          {reports.post_reports.map((r) => (
            <li key={r.id}>{r.description}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-[#5C2E0E]">User Reports</h3>
        <ul className="list-disc ml-6">
          {reports.user_reports.map((r) => (
            <li key={r.id}>{r.description}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-[#5C2E0E]">Bug Reports</h3>
        <ul className="list-disc ml-6">
          {reports.bug_reports.map((r) => (
            <li key={r.id}>{r.description}</li>
          ))}
        </ul>
      </section>


    </div>
  );
}
