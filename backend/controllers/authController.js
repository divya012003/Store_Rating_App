const bcrypt = require('bcrypt');
const db = require('../models/db'); // this is your promisified query function

exports.register = async (req, res) => {
  const { name, email, address, password ,role = 'normal' } = req.body;
  

  try {
    const hashed = await bcrypt.hash(password, 10);
    const q = 'INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)';
    await db(q, [name, email, address, hashed, role]);
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const q = 'SELECT * FROM users WHERE email = ?';
    const results = await db(q, [email]);

    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, results[0].password);
    if (!match) return res.status(401).json({ message: 'Wrong password' });

    req.session.user = {
      id: results[0].id,
      email: results[0].email,
      role: results[0].role,
      name: results[0].name
    };
    res.json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.session.user.id;

  try {
    const results = await db('SELECT * FROM users WHERE id = ?', [userId]);
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(oldPassword, results[0].password);
    if (!valid) return res.status(403).json({ message: 'Incorrect old password' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);

    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
