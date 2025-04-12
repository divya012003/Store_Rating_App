import { useState } from 'react';
import axios from '../api/axios';

const StoreCard = ({ store, fetchStores }) => {
  const [Rating, setSelectedRating] = useState(store.userRating || '');

  const handleRatingChange = (e) => {
    setSelectedRating(e.target.value);
  };

  const handleSubmit = async () => {
    if (!Rating) return alert('Please select a rating');
  
    try {
      await axios.post('/ratings/submit', {
        store_id: store.id,
        rating: Rating
      });
      alert('Rating submitted successfully');
      fetchStores(); // refresh data
    } catch (err) {
      alert('Failed to submit rating');
      console.error(err);
    }
  };
  

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h3>{store.name}</h3>
      <p>📍 Address: {store.address}</p>
      <p>⭐ Average Rating: {store.averageRating || 'Not yet rated'}</p>
      <p>🧑 Your Rating: {store.userRating || 'Not submitted'}</p>

      <select value={Rating} onChange={handleRatingChange}>
        <option value="">Select Rating</option>
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>

      <button onClick={handleSubmit}>
        {store.userRating ? 'Update Rating' : 'Submit Rating'}
      </button>
    </div>
  );
};

export default StoreCard;
