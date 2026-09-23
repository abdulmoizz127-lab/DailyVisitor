const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ABC123',
  database: 'dailyvisitor'
});

db.connect((err) => {
  if (err) {
    console.log('MySQL connection failed:', err.message);
  } else {
    console.log('MySQL connected successfully!');
  }
});

module.exports = db;