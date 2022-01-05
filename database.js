const pgp = require('pg-promise')({
  // Initialization Options
});

const cn = 'postgres://postgres:12345@93.188.35.136:5432/postgres';

const db = pgp(cn);

module.exports = db;    
