import React, { useEffect, useState } from 'react';
import axios from 'axios';
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" ></link>

function AdminDashboard() {
  const [section, setSection] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'normal' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [storeFilters, setStoreFilters] = useState({ name: '', address: '' });

  useEffect(() => {
    if (section === 'dashboard') {
      axios.get('http://localhost:3001/api/admin/dashboard', { withCredentials: true })
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }
    if (section === 'viewUsers') fetchUsers();
    if (section === 'viewStores') fetchStores();
  }, [section]);
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard'); // Adjust endpoint if needed
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    }
  };

  const fetchUsers = () => {
    axios.get('http://localhost:3001/api/admin/users', {
      params: userFilters,
      withCredentials: true
    })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  const fetchStores = () => {
    axios.get('http://localhost:3001/api/stores/search', {
      params: storeFilters,
      withCredentials: true
    })
      .then(res => setStores(res.data))
      .catch(err => console.error(err));
  };

  const handleAddUser = () => {
    axios.post('http://localhost:3001/api/admin/add-user', newUser, { withCredentials: true })
      .then(() => {
        alert('User added!');
        setNewUser({ name: '', email: '', password: '', address: '', role: 'normal' });
      })
      .catch(err => alert('Error adding user: ' + err.response?.data?.error));
  };

  const handleAddStore = () => {
    axios.post('http://localhost:3001/api/stores/add', newStore, { withCredentials: true })
      .then(() => {
        alert('Store added!');
        setNewStore({ name: '', email: '', address: '', owner_id: '' });
      })
      .catch(err => alert('Error adding store: ' + err.response?.data?.error));
  };

const StatCard = ({ label, value, suffix }) => (
    <div style={statCardStyle}>
      <p style={statTitleStyle}>{label}</p>
      <h2>{value} {suffix}</h2>
    </div>)
    const logout = () => {
        axios
          .post('http://localhost:3001/api/auth/logout', {}, { withCredentials: true })
          .then(() => (window.location.href = '/'))
          .catch(err => console.log(err));
      };
    

    

  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1100px',
    margin: '0 auto',
    backgroundColor: 'rgb(208, 214, 222)',
    marginTop:'100px'
    
  };

  const buttonGroupStyle = {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
    marginBottom: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  };

  const thtdStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left'
  };

  const sectionHeader = {
    marginTop: '10px',
    marginBottom: '10px',
    color: '#333'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: '#2c3e50',display:'flex',justifyContent:'center' }}>Admin Dashboard</h1>

      <div style={buttonGroupStyle }>
        <button onClick={() => setSection('dashboard')} style={{ background: '#2c3e50',}}>Dashboard</button>
        <button onClick={() => setSection('addUser')} style={{ background: 'orange'}}>Add User</button>
        <button onClick={() => setSection('addStore')} style={{ background: '#2c3e50'}}>Add Store</button>
        <button onClick={() => setSection('viewUsers')} style={{ background: 'green'}}>View Users</button>
        <button onClick={() => setSection('viewStores')} style={{ background: '#2c3e50'}}>View Stores</button>
        <button onClick={logout}  style={{ background: 'red'}}>Logout</button>
      </div>

      {section === 'dashboard' && (
        <div>
         

{/* Stats Cards */}
<div style={statsContainer}>
  <StatCard label="Total Stores" value={stats.stores} />
  <StatCard label="Total User" value={stats.users} />
  <StatCard label="Avg Rating" value={stats.avgRating ?? 'N/A'} suffix="⭐" />
  <StatCard label="New Rating" value={stats.newReviews} />
</div>

{/* Latest Reviews */}
<div style={sectionBlock}>
  <h2 style={sectionHeader}>Latest Reviews</h2>
  {(stats.recentReviews ?? []).length === 0 ? (
    <p>No recent reviews available.</p>
  ) : (
    (stats.recentReviews ?? []).map((review, idx) => (
      <div key={idx} style={reviewCard}>
        <strong>{review.storeName}</strong> – {Array(review.rating).fill('⭐').join('')}
        <p style={{ margin: '5px 0', fontStyle: 'italic' }}>{review.comment}</p>
        <p style={reviewTime}>{review.timeAgo}</p>
      </div>
    ))
  )}
</div>

{/* Top Stores Table */}
<div style={sectionBlock}>
  <h2 style={sectionHeader}>Top Stores</h2>
  {(stats.topStores ?? []).length === 0 ? (
    <p>No top stores data available.</p>
  ) : (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thtdStyle}>Store</th>
          <th style={thtdStyle}>Rating</th>
          <th style={thtdStyle}>Reviews</th>
        </tr>
      </thead>
      <tbody>
        {(stats.topStores ?? []).map((store, idx) => (
          <tr key={idx}>
            <td style={thtdStyle}>{store.name}</td>
            <td style={thtdStyle}>{store.rating}</td>
            <td style={thtdStyle}>{store.reviews}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
        </div>
        
      )}

      {section === 'addUser' && (
        <div>
          <h2 style={sectionHeader}>Add New User</h2>
          <div style={formGroupStyle}>
            <input placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
            <input placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
            <input placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
            <input placeholder="Address" value={newUser.address} onChange={e => setNewUser({ ...newUser, address: e.target.value })} />
            <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="normal">Normal</option>
              <option value="admin">Admin</option>
              <option value="admin">Owner</option>
            </select>
            <button onClick={handleAddUser}>Add User</button>
          </div>
        </div>
      )}

      {section === 'addStore' && (
        <div>
          <h2 style={sectionHeader}>Add New Store</h2>
          <div style={formGroupStyle}>
            <input placeholder="Store Name" value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} />
            <input placeholder="Store Email" value={newStore.email} onChange={e => setNewStore({ ...newStore, email: e.target.value })} />
            <input placeholder="Store Address" value={newStore.address} onChange={e => setNewStore({ ...newStore, address: e.target.value })} />
            <input placeholder="Owner ID" value={newStore.owner_id} onChange={e => setNewStore({ ...newStore, owner_id: e.target.value })} />
            <button onClick={handleAddStore}>Add Store</button>
          </div>
        </div>
      )}

      {section === 'viewUsers' && (
        <div>
          <h2 style={sectionHeader}>All Users</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <input placeholder="Name" onChange={e => setUserFilters({ ...userFilters, name: e.target.value })} />
            <input placeholder="Email" onChange={e => setUserFilters({ ...userFilters, email: e.target.value })} />
            <input placeholder="Address" onChange={e => setUserFilters({ ...userFilters, address: e.target.value })} />
            <select onChange={e => setUserFilters({ ...userFilters, role: e.target.value })}>
              <option value="">All Roles</option>
              <option value="normal">Normal</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={fetchUsers}>Search</button>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thtdStyle}>Name</th>
                <th style={thtdStyle}>Email</th>
                <th style={thtdStyle}>Address</th>
                <th style={thtdStyle}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={thtdStyle}>{u.name}</td>
                  <td style={thtdStyle}>{u.email}</td>
                  <td style={thtdStyle}>{u.address}</td>
                  <td style={thtdStyle}>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section === 'viewStores' && (
        <div>
          <h2 style={sectionHeader}>All Stores</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <input placeholder="Store Name" onChange={e => setStoreFilters({ ...storeFilters, name: e.target.value })} />
            <input placeholder="Address" onChange={e => setStoreFilters({ ...storeFilters, address: e.target.value })} />
            <button onClick={fetchStores}>Search</button>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thtdStyle}>Name</th>
                <th style={thtdStyle}>Email</th>
                <th style={thtdStyle}>Address</th>
                <th style={thtdStyle}>Average Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id}>
                  <td style={thtdStyle}>{s.name}</td>
                  <td style={thtdStyle}>{s.email}</td>
                  <td style={thtdStyle}>{s.address}</td>
                  <td style={thtdStyle}>{s.averageRating ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      )}
    </div>
  );
  
}

export default AdminDashboard;
 
// ✅ Styles
const dashboardContainer = {
    maxWidth: '1200px',
    margin: '30px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };
  
  const mainHeader = {
    marginBottom: '30px',
    color: '#333',
  };
  
  const statsContainer = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '40px',
  };
  
  const statCardStyle = {
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    padding: '20px',
    flex: '1 1 200px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };
  
  const statTitleStyle = {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };
  
  const sectionBlock = {
    marginTop: '40px',
  };
  
  const sectionHeader = {
    marginBottom: '20px',
    fontSize: '20px',
    color: '#333',
  };
  
  const reviewCard = {
    padding: '10px 15px',
    marginBottom: '10px',
    border: '1px solid #eee',
    borderRadius: '6px',
    backgroundColor: '#fff',
  };
  
  const reviewTime = {
    fontSize: '12px',
    color: '#888',
  };
  
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  };
  
  const thtdStyle = {
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
    textAlign: 'left',
  };