const express = require('express');
const { sql } = require('../db');
const router = express.Router();

// POST /api/users (register a new user)
router.post('/', async (req, res) => {
  const { StudentId, Username, Password, Name, Email, Role } = req.body;

  try {
    const result = await sql.query`
      INSERT INTO dbo.Users (StudentId, Username, Password, Name, Email, Role)
      VALUES (${StudentId}, ${Username}, ${Password}, ${Name}, ${Email}, ${Role});
      SELECT SCOPE_IDENTITY() AS Id;
    `;
    res.status(201).json({ Id: result.recordset[0].Id });
  } catch (err) {
    console.error('POST /api/users error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users (get all users)
router.get('/', async (req, res) => {
  try {
    const { recordset } = await sql.query`
      SELECT Id, StudentId, Username, Name, Email, Role FROM dbo.Users
    `;
    res.json(recordset);
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:id (get user by id)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { recordset } = await sql.query`
      SELECT Id, StudentId, Username, Name, Email, Role FROM dbo.Users WHERE Id = ${id}
    `;
    if (!recordset.length) return res.status(404).json({ error: 'User not found' });
    res.json(recordset[0]);
  } catch (err) {
    console.error('GET /api/users/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Name, Email } = req.body;

  try {
    await sql.query`
      UPDATE dbo.Users
      SET
        Name  = ${Name},
        Email = ${Email}
      WHERE Id = ${id};
    `;
    // 204 No Content on success
    res.status(204).end();
  } catch (err) {
    console.error('PUT /api/users/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id (delete user)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query`DELETE FROM dbo.Users WHERE Id = ${id}`;
    res.status(204).end(); // No content to return
  } catch (err) {
    console.error('DELETE /api/users/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
