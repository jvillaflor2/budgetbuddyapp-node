require('dotenv').config();
const { Pool } = require('pg');
const types = require('pg').types;

types.setTypeParser(1082, (val) => val);
types.setTypeParser(1700, (val) => parseFloat(val));

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = pool;