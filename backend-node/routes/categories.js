const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});
router.post('/', async (req, res) => {
  const { name, type, budget_limit } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO categories (name, type, budget_limit) VALUES ($1, $2, $3) RETURNING *',
      [name, type, budget_limit]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});
module.exports = router;