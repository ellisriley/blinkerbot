// db.js
// ver 2.0.0A1
// riley ellis 2026
// connects to postgres database and queries for data , running on sql02.pve01.ellisnet.me (postgres01.ellisnet.me)

const pg = require("pg");
const dbconf = require("./db.json");
const tools = require("./tools.js");
const { resolveBuilder } = require("discord.js");

const pool = new pg.Pool({
  user: dbconf.user,
  host: dbconf.host,
  database: dbconf.database,
  password: dbconf.password,
  port: dbconf.port,
});

async function query(sql){
  const client = await pool.connect();
  const res = await client.query(sql);
  client.release();
  return res;
}

async function doesUserExist(discordId) {
  
}

async function createUserRecord(discordId) {
  const res = await query(`INSERT INTO `+dbconf.schema+`.users(username, user_discord_id) VALUES (`+tools.getMemberDisplayNameFromId(discordId)+`,`+discordId+`);`);
  return res;
}

async function createLogRecord(userId, logType){
  const logTime = Math.floor(new Date().getTime() / 1000);
  const resCreate = await query(`INSERT INTO `+dbconf.schema+`.logs(user_id, log_timestamp, log_type) VALUES ((SELECT user_id FROM `+dbconf.schema+`.users WHERE user_discord_id=`+userId+`), "`+logTime`", (SELECT type_id FROM `+dbconf.schema+`.types WHERE type_description="`+logType+`"));`)
  return res;
}

async function getRecordByUserId(userId) {
  const res = await query();
  return res.rows[0].type_description;
} 

module.exports = { query , getRecordByUserId } 