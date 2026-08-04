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

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, category_id, date, note } = req.body;

  try {
    const result = await pool.query(
      'UPDATE transactions SET amount = $1, category_id = $2, date = $3, note = $4 WHERE id = $5 RETURNING *',
      [amount, category_id, date, note, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted', deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});


module.exports = router;