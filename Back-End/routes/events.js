const express = require('express');
const { sql } = require('../db');
const router = express.Router();

// POST /api/events (create a new event)
router.post('/', async (req, res) => {
  const { Title, StartTime, EndTime, CategoryId, Course } = req.body;

  try {
    const result = await sql.query`
      INSERT INTO dbo.Events (Title, StartTime, EndTime, CategoryId, Course)
      VALUES (${Title}, ${StartTime}, ${EndTime}, ${CategoryId}, ${Course});
      SELECT SCOPE_IDENTITY() AS Id;
    `;
    res.status(201).json({ Id: result.recordset[0].Id });
  } catch (err) {
    console.error('POST /api/events error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events (get all events)
router.get('/', async (req, res) => {
  try {
    const { recordset } = await sql.query`
      SELECT Id, Title, StartTime, EndTime, CategoryId, Course FROM dbo.Events
    `;
    res.json(recordset);
  } catch (err) {
    console.error('GET /api/events error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/:id (get event by id)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { recordset } = await sql.query`
      SELECT Id, Title, StartTime, EndTime, CategoryId, Course FROM dbo.Events WHERE Id = ${id}
    `;
    if (!recordset.length) return res.status(404).json({ error: 'Event not found' });
    res.json(recordset[0]);
  } catch (err) {
    console.error('GET /api/events/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/events/:id (update event)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Title, StartTime, EndTime, CategoryId, Course } = req.body;

  try {
    await sql.query`
      UPDATE dbo.Events
      SET Title = ${Title}, StartTime = ${StartTime}, EndTime = ${EndTime}, CategoryId = ${CategoryId}, Course = ${Course}
      WHERE Id = ${id}
    `;
    res.status(204).end();
  } catch (err) {
    console.error('PUT /api/events/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/events/:id (delete event)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query`DELETE FROM dbo.Events WHERE Id = ${id}`;
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /api/events/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
