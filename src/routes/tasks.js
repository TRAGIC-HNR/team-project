const express = require('express');
const pool = require('../db');

const router = express.Router();
const VALID_STATUS = ['pending', 'in-progress', 'completed'];

// CREATE - POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUS.join(', ')}` });
    }

    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, status)
       VALUES ($1, $2, COALESCE($3, 'pending'))
       RETURNING *`,
      [title.trim(), description || null, status || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// READ ALL - GET /api/tasks  (optional ?status=pending)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let result;
    if (status) {
      if (!VALID_STATUS.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${VALID_STATUS.join(', ')}` });
      }
      result = await pool.query('SELECT * FROM tasks WHERE status = $1 ORDER BY id DESC', [status]);
    } else {
      result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// READ ONE - GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE - PUT /api/tasks/:id  (send only the fields you want to change)
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const { title, description, status } = req.body;

    if (title !== undefined && !String(title).trim()) {
      return res.status(400).json({ error: 'title cannot be empty' });
    }
    if (status !== undefined && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUS.join(', ')}` });
    }

    const { rows } = await pool.query(
      `UPDATE tasks
       SET title       = COALESCE($1, title),
           description = COALESCE($2, description),
           status      = COALESCE($3, status),
           updated_at  = NOW()
       WHERE id = $4
       RETURNING *`,
      [title !== undefined ? String(title).trim() : null, description ?? null, status ?? null, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE - DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const { rows } = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted', task: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
