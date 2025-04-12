const db = require('../models/db');

exports.getAllStores = async (req, res) => {
  const q = `
    SELECT s.*, 
    ROUND(AVG(r.rating), 1) AS averageRating,
    (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) AS userRating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    GROUP BY s.id
  `;
  try {
    const results = await db(q, [req.session.user.id]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchStores = async (req, res) => {
  const { name = '', address = '' } = req.query;
  const q = `SELECT * FROM stores WHERE name LIKE ? AND address LIKE ?`;
  try {
    const results = await db(q, [`%${name}%`, `%${address}%`]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  const q = `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`;
  try {
    await db(q, [name, email, address, owner_id]);
    res.json({ message: 'Store added' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
