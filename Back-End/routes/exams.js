const express = require('express');
const { sql } = require('../db');
const router = express.Router();

// POST /api/exams (create a new exam)
router.post('/', async (req, res) => {
  const { Title, Course, ExamDate, ExamTime, Location, Materials } = req.body;

  try {
    const result = await sql.query`
      INSERT INTO dbo.Exams (Title, Course, ExamDate, ExamTime, Location, Materials)
      VALUES (${Title}, ${Course}, ${ExamDate}, ${ExamTime}, ${Location}, ${Materials});
      SELECT SCOPE_IDENTITY() AS Id;
    `;
    res.status(201).json({ Id: result.recordset[0].Id });
  } catch (err) {
    console.error('POST /api/exams error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/exams (get all exams)
router.get('/', async (req, res) => {
  try {
    const { recordset } = await sql.query`
      SELECT Id, Title, Course, ExamDate, ExamTime, Location, Materials FROM dbo.Exams
    `;
    res.json(recordset);
  } catch (err) {
    console.error('GET /api/exams error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/exams/:id (get exam by id)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { recordset } = await sql.query`
      SELECT Id, Title, Course, ExamDate, ExamTime, Location, Materials FROM dbo.Exams WHERE Id = ${id}
    `;
    if (!recordset.length) return res.status(404).json({ error: 'Exam not found' });
    res.json(recordset[0]);
  } catch (err) {
    console.error('GET /api/exams/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/exams/:id (update exam)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Title, Course, ExamDate, ExamTime, Location, Materials } = req.body;

  try {
    await sql.query`
      UPDATE dbo.Exams
      SET Title = ${Title}, Course = ${Course}, ExamDate = ${ExamDate}, ExamTime = ${ExamTime},
          Location = ${Location}, Materials = ${Materials}
      WHERE Id = ${id}
    `;
    res.status(204).end();
  } catch (err) {
    console.error('PUT /api/exams/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/exams/:id (delete exam)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query`DELETE FROM dbo.Exams WHERE Id = ${id}`;
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /api/exams/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
