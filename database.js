const pgp = require('pg-promise')({
  // Initialization Options
});

const cn = 'postgres://postgres:12345@192.168.0.114:5432/postgres';

const db = pgp(cn);

module.exports = db;
