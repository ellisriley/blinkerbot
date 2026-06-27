// db.js
// ver 2.0.0A1
// riley ellis 2026
// connects to postgres database and queries for data , running on sql02.pve01.ellisnet.me (postgres01.ellisnet.me)

const pg = require("pg");

const pool = new pg.Pool({
  user: "riley",
  host: "postgres01.ellisnet.me",
  database: "blinky",
  password: "blinky123",
  port: 5432,
});

async function query(){
  const client = await pool.connect();
  const res = await client.query(`SELECT * FROM blinkystaging.types`);
  return res;
}
async function getRecordByUserId(userId) {
  const res = await query();
  return res.rows[0].type_description;
} 

module.exports = { query , getRecordByUserId } 