const express = require('express');
const db = require('../../config/db');

const router = express.Router();

router.post('/login', (req, res) => {

  console.log('Visitor login API called');
  console.log('Login data:', req.body);

  let { email, password } = req.body;

  // Remove extra spaces from email
  email = email ? email.trim() : '';

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    });
  }

  // Find visitor/service provider by email
  const sql = `
    SELECT user_id, user_name, user_email, user_password, role
    FROM User
    WHERE TRIM(user_email) = ? AND role = 'PROVIDER'
  `;

  db.query(sql, [email], (err, results) => {

    if (err) {
      console.log('Login error:', err.message);

      return res.status(500).json({
        message: 'Server error'
      });
    }

    console.log('Database result:', results);

    // Email not found
    if (results.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const user = results[0];

    // Check password
    if (password !== user.user_password) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Login successful
    console.log('Visitor login successful');

    res.status(200).json({
      message: 'Visitor login successful!',
      userId: user.user_id,
      name: user.user_name,
      email: user.user_email,
      role: user.role
    });

  });
});

module.exports = router;