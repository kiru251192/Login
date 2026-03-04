const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'logins.db');
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

// expose a simple prepared statement helper
module.exports = {
  prepare: (sql) => db.prepare(sql),
  run: (sql, params, callback) => db.run(sql, params, callback),
  all: (sql, params, callback) => db.all(sql, params, callback),
};