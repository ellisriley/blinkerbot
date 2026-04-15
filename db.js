const mysql = require('mysql2/promise');

const db = require("./db.json")

async function query(sql, params) {
  const connection = await mysql.createConnection(db);
  const [results, ] = await connection.execute(sql, params);

  return results;
}

async function getRecordByUserId(userId) {
  return await query("SELECT * FROM scores WHERE userId=\""+userId+"\";");
}

async function doesRecordExist(userId) {
  const record = await query("SELECT userId FROM scores WHERE userId=\""+userId+"\";");
  if (record.length===0) {
    return false;
  }else {
    return true;
  }
}

async function createRecord(userId) {
  await query("INSERT INTO scores (userId, blinkers, joints, edibles, bongs) VALUES (\""+userId+"\",0,0,0,0);");
}

async function increment(userId, field) {
  query("UPDATE scores SET " + field + "=" + field + "+1 WHERE userId= \""+userId+"\";");
}

async function incrementByHalf(userId, field) {
  query("UPDATE scores SET " + field + "=" + field + "+0.5 WHERE userId= \""+userId+"\";");
}

module.exports = {
  query, getRecordByUserId, doesRecordExist, createRecord, increment, incrementByHalf
}