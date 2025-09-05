const express = require('express');
const { sql } = require('../db');
const router = express.Router();

// POST /api/assignments (create a new assignment)
router.post('/', async (req, res) => {
  const { Title, Course, DueDate, Status } = req.body;

  try {
    const result = await sql.query`
      INSERT INTO dbo.Assignments (Title, Course, DueDate, Status)
      VALUES (${Title}, ${Course}, ${DueDate}, ${Status});
      SELECT SCOPE_IDENTITY() AS Id;
    `;
    res.status(201).json({ Id: result.recordset[0].Id });
  } catch (err) {
    console.error('POST /api/assignments error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/assignments (get all assignments)
router.get('/', async (req, res) => {
  try {
    const { recordset } = await sql.query`
      SELECT Id, Title, Course, DueDate, Status FROM dbo.Assignments
    `;
    res.json(recordset);
  } catch (err) {
    console.error('GET /api/assignments error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/assignments/:id (get assignment by id)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { recordset } = await sql.query`
      SELECT Id, Title, Course, DueDate, Status FROM dbo.Assignments WHERE Id = ${id}
    `;
    if (!recordset.length) return res.status(404).json({ error: 'Assignment not found' });
    res.json(recordset[0]);
  } catch (err) {
    console.error('GET /api/assignments/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/assignments/:id (update assignment)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Title, Course, DueDate, Status } = req.body;

  try {
    await sql.query`
      UPDATE dbo.Assignments
      SET Title = ${Title}, Course = ${Course}, DueDate = ${DueDate}, Status = ${Status}
      WHERE Id = ${id}
    `;
    res.status(204).end();
  } catch (err) {
    console.error('PUT /api/assignments/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/assignments/:id (delete assignment)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query`DELETE FROM dbo.Assignments WHERE Id = ${id}`;
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /api/assignments/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
