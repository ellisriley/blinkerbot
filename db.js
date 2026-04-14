const mysql = require('mysql2/promise');

const db = require("./db.json")

async function query(sql, params) {
  const connection = await mysql.createConnection(db);
  const [results, ] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query
}