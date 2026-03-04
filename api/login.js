const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Vercel functions run in a read-only filesystem; /tmp is writable but ephemeral
const dbPath = path.join('/tmp', 'logins.db');
const db = new sqlite3.Database(dbPath);

// ensure table exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS logins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
});

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password required' });
    return;
  }

  const stmt = db.prepare('INSERT INTO logins (username, password, created_at) VALUES (?, ?, ?)');
  stmt.run(username, password, new Date().toISOString(), function(err) {
    if (err) {
      res.status(500).json({ error: 'DB error' });
    } else {
      res.status(200).json({ success: true });
    }
  });
};