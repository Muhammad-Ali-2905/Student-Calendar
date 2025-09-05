const express = require('express');
const router = express.Router();
const { sql } = require('../db');

// POST /api/login (for login functionality)
router.post('/', async (req, res) => {
  const { Username, Password } = req.body;

  try {
    // Query the user by username
    const { recordset } = await sql.query`
      SELECT Id, Username, Password, Role FROM dbo.Users WHERE Username = ${Username}
    `;
    
    if (recordset.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = recordset[0];

    // Directly compare the entered password with the stored password (no hashing)
    if (user.Password !== Password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // If passwords match, return user data (or a token for session management)
    res.json({ id: user.Id, username: user.Username, role: user.Role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
