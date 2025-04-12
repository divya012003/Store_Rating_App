import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Style.css';

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [view, setView] = useState('stores');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = () => {
    axios
      .get('http://localhost:3001/api/stores', { withCredentials: true })
      .then(res => setStores(res.data))
      .catch(err => console.log(err));
  };

  const searchStores = () => {
    axios
      .get(`http://localhost:3001/api/stores/search?name=${searchName}&address=${searchAddress}`, { withCredentials: true })
      .then(res => setStores(res.data))
      .catch(err => console.log(err));
  };

  const handleRatingChange = (storeId, rating) => {
    axios
      .post(
        'http://localhost:3001/api/ratings/submit',
        {
          store_id: storeId,
          rating: parseInt(rating)
        },
        { withCredentials: true }
      )
      .then(() => fetchStores())
      .catch(err => console.log(err));
  };

  const updatePassword = () => {
    axios
      .put(
        'http://localhost:3001/api/auth/password',
        { newPassword },
        { withCredentials: true }
      )
      .then(() => alert('Password updated'))
      .catch(() => alert('Error updating password'));
  };

  const logout = () => {
    axios
      .post('http://localhost:3001/api/auth/logout', {}, { withCredentials: true })
      .then(() => (window.location.href = '/'))
      .catch(err => console.log(err));
  };

  return (
    <div className="dashboard-container">
      <h2 >Owner Dashboard</h2>

      <div className="dashboard-buttons">
        <button onClick={() => setView('stores')}>View Stores</button>
        <button onClick={() => setView('update-password')}>Update Password</button>
        <button onClick={logout}>Logout</button>
      </div>

      {view === 'stores' && (
        <div>
          <h3>Store Listings</h3>

          <div className="search-container">
            <input
              placeholder="Search by name"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
            />
            <input
              placeholder="Search by address"
              value={searchAddress}
              onChange={e => setSearchAddress(e.target.value)}
            />
            <button onClick={searchStores}>Search</button>
          </div>

          <div className="table-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Address</th>
                  <th>Average Rating</th>
                  <th>Your Rating</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {stores.map(store => (
                  <tr key={store.id}>
                    <td>{store.name}</td>
                    <td>{store.address}</td>
                    <td>{store.averageRating || 'N/A'}</td>
                    <td>{store.userRating || '-'}</td>
                    <td>
                      <select
                        defaultValue={store.userRating || ''}
                        onChange={e => handleRatingChange(store.id, e.target.value)}
                      >
                        <option value="">--Select--</option>
                        {[1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'update-password' && (
        <div className="password-update-form">
          <h3>Update Password</h3>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <button onClick={updatePassword}>Update</button>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
