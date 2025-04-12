import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [view, setView] = useState('stores'); // 'stores' | 'update-password'
  const navigate = useNavigate();

  
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = () => {
    axios.get('http://localhost:3001/api/stores', { withCredentials: true })
      .then(res => setStores(res.data))
      .catch(err => console.log(err));
  };

  const searchStores = () => {
    axios.get(`http://localhost:3001/api/stores/search?name=${searchName}&address=${searchAddress}`, { withCredentials: true })
      .then(res => setStores(res.data))
      .catch(err => console.log(err));
  };

  const handleRatingChange = (storeId, rating) => {
    axios.post('http://localhost:3001/api/ratings/submit', {
      store_id: storeId,
      rating: parseInt(rating)
    }, { withCredentials: true })
      .then(() => fetchStores())
      .catch(err => console.log(err));
  };

  const updatePassword = () => {
    axios.put('http://localhost:3001/api/auth/password', {
      newPassword
    }, { withCredentials: true })
      .then(() => alert('Password updated'))
      .catch(err => alert('Error updating password'));
  };

  const logout = () => {
    axios.post('http://localhost:3001/api/auth/logout', {}, { withCredentials: true })
      .then(() => window.location.href = '/')
      .catch(err => console.log(err));
  };

  return (
    <div style={{ padding: '20px' }} >
      <h2>Welcome to User Dashboard</h2>

      <div style={{ marginBottom: '20px' }}>
        <button className='m-3 btn btn-red' onClick={() => setView('stores')}>View Stores</button>
        <button onClick={() => navigate('/rate-stores')}>Rate Stores</button>

        <button onClick={() => setView('update-password')}>Update Password</button>
        <button onClick={logout}>Logout</button>
      </div>

      {view === 'stores' && (
        <div>
          <h3>Store Listings</h3>
          <input placeholder="Search Name" value={searchName} onChange={e => setSearchName(e.target.value)} />
          <input placeholder="Search Address" value={searchAddress} onChange={e => setSearchAddress(e.target.value)} />
          <button onClick={searchStores}>Search</button>

          <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%' }}>
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Address</th>
                <th>Average Rating</th>
                <th>Your Rating</th>
                <th>Submit/Update</th>
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
                      onChange={(e) => handleRatingChange(store.id, e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'update-password' && (
        <div>
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

export default UserDashboard;
