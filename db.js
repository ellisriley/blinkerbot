// db.js
// ver 2.0.0A1
// riley ellis 2026
// connects to postgres database and queries for data , running on sql02.pve01.ellisnet.me (internal dns postgres01.ellisnet.me)

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

async function getTypes() {
  const res = query(`SELCT * FROM `+dbconf.schema+`.types`);
  return res.rows;
}

async function doesUserExist(discordId) {
  const res = await query(`SELECT * FROM `+dbconf.schema+`.users WHERE user_discord_id=`+discordId+`;`);
  return res.rowCount > 0;
}

async function createUserRecord(interaction, discordId) {
  const displayName =await tools.getMemberDisplayNameFromId(interaction, discordId);
  const res = await query(`INSERT INTO `+dbconf.schema+`.users(username, user_discord_id) VALUES ('`+displayName+`',`+discordId+`);`);
  return res; 
}

async function checkUserSafe(interaction, userId) {
  if (await doesUserExist(userId) === false) {
    await createUserRecord(interaction, userId);
  } 
}

async function createLogRecord(interaction, userId, logType){
  const logTime = Math.floor(new Date().getTime() / 1000);
  await checkUserSafe(interaction, userId);
  console.log(logType);
  const resCreate = await query(`INSERT INTO `+dbconf.schema+`.logs(user_id, log_time, log_type) VALUES ((SELECT user_id FROM `+dbconf.schema+`.users WHERE user_discord_id=`+userId+`), `+logTime+`, (SELECT type_id FROM `+dbconf.schema+`.types WHERE type_description='`+logType+`'));`);
  return resCreate;
}

async function getCurrentAmount(userId, type) {
  const value = await query(`SELECT * FROM `+dbconf.schema+`.logs WHERE user_id=(SELECT user_id FROM `+dbconf.schema+`.users WHERE user_discord_id=`+userId+`) AND log_type=(SELECT type_id FROM `+dbconf.schema+`.types WHERE type_description=`+type+`);`);
}

async function getRecordByUserId(userId) {
  const res = await query();
} 

module.exports = { query , getRecordByUserId, doesUserExist, createUserRecord, createLogRecord } 