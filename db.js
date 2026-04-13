const mysql = require('mysql2/promise');

const db = {
    /* don't expose password or any sensitive info, done only for demo */
    host: "127.0.0.1",
    user: "blinky",
    password: "password",
    database: "blinkerbot",
    connectTimeout: 60000
  };

async function query(sql, params) {
  const connection = await mysql.createConnection(db);
  const [results, ] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query
}