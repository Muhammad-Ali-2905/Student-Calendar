const express = require('express');
const { sql } = require('../db');
const router = express.Router();

// POST /api/courses (create a new course)
router.post('/', async (req, res) => {
  const { Title, Instructor, Schedule, Description } = req.body;

  try {
    const result = await sql.query`
      INSERT INTO dbo.Courses (Title, Instructor, Schedule, Description)
      VALUES (${Title}, ${Instructor}, ${Schedule}, ${Description});
      SELECT SCOPE_IDENTITY() AS Id;
    `;
    res.status(201).json({ Id: result.recordset[0].Id });
  } catch (err) {
    console.error('POST /api/courses error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/courses (get all courses)
router.get('/', async (req, res) => {
  try {
    const { recordset } = await sql.query`
      SELECT Id, Title, Instructor, Schedule, Description FROM dbo.Courses
    `;
    res.json(recordset);
  } catch (err) {
    console.error('GET /api/courses error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/courses/:id (get course by id)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { recordset } = await sql.query`
      SELECT Id, Title, Instructor, Schedule, Description FROM dbo.Courses WHERE Id = ${id}
    `;
    if (!recordset.length) return res.status(404).json({ error: 'Course not found' });
    res.json(recordset[0]);
  } catch (err) {
    console.error('GET /api/courses/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/courses/:id (update course)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Title, Instructor, Schedule, Description } = req.body;

  try {
    await sql.query`
      UPDATE dbo.Courses
      SET Title = ${Title}, Instructor = ${Instructor}, Schedule = ${Schedule}, Description = ${Description}
      WHERE Id = ${id}
    `;
    res.status(204).end();
  } catch (err) {
    console.error('PUT /api/courses/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/courses/:id (delete course)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query`DELETE FROM dbo.Courses WHERE Id = ${id}`;
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /api/courses/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
