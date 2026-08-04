const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER by date DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error:'Failed to fetch transactions'});
    }
});

router.post('/', async (req, res) => {
  const { amount, category_id, date, note } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO transactions (amount, category_id, date, note) VALUES ($1, $2, $3, $4) RETURNING *',
      [amount, category_id, date, note]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

module.exports = router;