import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreRating = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [newRating, setNewRating] = useState({});

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/stores', {
        withCredentials: true,
      });
      setStores(res.data);

      // Fetch ratings by current user
      const ratingsRes = await axios.get('http://localhost:3001/api/ratings/my-ratings', {
        withCredentials: true,
      });

      const ratingMap = {};
      ratingsRes.data.forEach(r => {
        ratingMap[r.store_id] = r.rating;
      });

      setUserRatings(ratingMap);
      setNewRating(ratingMap); // Pre-fill existing
    } catch (err) {
      console.error(err);
    }
  };

  const handleRatingChange = (storeId, value) => {
    setNewRating(prev => ({ ...prev, [storeId]: value }));
  };

  const submitRating = async (storeId) => {
    const ratingValue = parseInt(newRating[storeId]);
    if (ratingValue < 1 || ratingValue > 5) return alert('Rating must be between 1 and 5');

    try {
      await axios.post('http://localhost:3001/api/ratings', {
        store_id: storeId,
        rating: ratingValue,
      }, { withCredentials: true });

      alert('Rating submitted/updated!');
      fetchStores(); // Refresh data
    } catch (err) {
      console.error(err);
      alert('Failed to submit rating');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Rate Stores</h2>
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Average Rating</th>
            <th>Your Rating</th>
            <th>Submit</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{store.averageRating || 'No Ratings'}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newRating[store.id] || ''}
                  onChange={(e) => handleRatingChange(store.id, e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => submitRating(store.id)}>
                  {userRatings[store.id] ? 'Update' : 'Submit'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreRating;
