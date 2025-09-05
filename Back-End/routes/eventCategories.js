const express = require('express');
const { sql } = require('../db');
const router = express.Router();

// POST /api/eventCategories (create a new event category)
router.post('/', async (req, res) => {
  const { Name } = req.body;

  try {
    const result = await sql.query`
      INSERT INTO dbo.EventCategories (Name)
      VALUES (${Name});
      SELECT SCOPE_IDENTITY() AS Id;
    `;
    res.status(201).json({ Id: result.recordset[0].Id });
  } catch (err) {
    console.error('POST /api/eventCategories error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/eventCategories (get all event categories)
router.get('/', async (req, res) => {
  try {
    const { recordset } = await sql.query`
      SELECT Id, Name FROM dbo.EventCategories
    `;
    res.json(recordset);
  } catch (err) {
    console.error('GET /api/eventCategories error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/eventCategories/:id (get event category by id)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { recordset } = await sql.query`
      SELECT Id, Name FROM dbo.EventCategories WHERE Id = ${id}
    `;
    if (!recordset.length) return res.status(404).json({ error: 'Event category not found' });
    res.json(recordset[0]);
  } catch (err) {
    console.error('GET /api/eventCategories/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/eventCategories/:id (update event category)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Name } = req.body;

  try {
    await sql.query`
      UPDATE dbo.EventCategories
      SET Name = ${Name}
      WHERE Id = ${id}
    `;
    res.status(204).end();
  } catch (err) {
    console.error('PUT /api/eventCategories/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/eventCategories/:id (delete event category)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query`DELETE FROM dbo.EventCategories WHERE Id = ${id}`;
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /api/eventCategories/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
