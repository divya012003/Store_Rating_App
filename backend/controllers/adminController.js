const db = require('../models/db');
const bcrypt = require('bcrypt');

exports.getDashboardStats = async (req, res) => {
  try {
    const users = await db('SELECT COUNT(*) AS users FROM users WHERE role = "normal"');
    const stores = await db('SELECT COUNT(*) AS stores FROM stores');
    const ratings = await db('SELECT COUNT(*) AS ratings FROM ratings');
    
    res.json({
      users: users[0].users,
      stores: stores[0].stores,
      ratings: ratings[0].ratings
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
};

exports.addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db(
      'INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, address, hashed, role]
    );
    res.json({ message: 'User added' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  const { name = '', email = '', address = '', role = '' } = req.query;
  const q = `SELECT * FROM users WHERE name LIKE ? AND email LIKE ? AND address LIKE ? AND role LIKE ?`;

  try {
    const results = await db(q, [`%${name}%`, `%${email}%`, `%${address}%`, `%${role}%`]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listStores = async (req, res) => {
  const q = `
    SELECT s.*, ROUND(AVG(r.rating), 1) as averageRating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    GROUP BY s.id
  `;
  try {
    const results = await db(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
