const db = require('../models/db');

exports.submitRating = async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.session.user.id;

  try {
    const check = 'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?';
    const results = await db(check, [user_id, store_id]);

    if (results.length > 0) {
      // Update rating
      await db('UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?', [rating, user_id, store_id]);
    } else {
      // Insert rating
      await db('INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)', [user_id, store_id, rating]);
    }

    res.json({ message: 'Rating submitted/updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
