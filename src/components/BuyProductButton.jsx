import React from 'react';

export default function BuyProductButton({ postId, token, onNavigate }) {
  const handleBuy = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/messaging/buy-product/${postId}/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to start conversation');

      const data = await res.json();
      if (data.conversation_id) {
        onNavigate('messaging'); // Navigate to messaging page
      } else {
        alert('Conversation started');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <button
      onClick={handleBuy}
      className="mt-3 px-4 py-2 bg-[#5C2E0E] text-white rounded-lg shadow hover:bg-[#4A2600] transition duration-200"
    >
      Buy Product
    </button>
  );
}
