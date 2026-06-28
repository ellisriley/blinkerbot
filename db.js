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
pool.on('connect', async (client) => {
    await client.query(`SET search_path TO ${dbconf.schema}`);
});

async function query(sql){
  //console.log(sql);
  const client = await pool.connect();
  const res = await client.query(sql);
  client.release();
  return res;
}

async function getTypes() {
  const res = query(`SELCT * FROM types`);
  return res.rows;
}

async function doesUserExist(discordId) {
  const res = await query(`SELECT * FROM users WHERE user_discord_id=`+discordId+`;`);
  return res.rowCount > 0;
}

async function createUserRecord(interaction, discordId) {
  const displayName =await tools.getMemberDisplayNameFromId(interaction, discordId);
  const res = await query(`INSERT INTO users(username, user_discord_id) VALUES ('`+displayName+`',`+discordId+`);`);
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
  const resCreate = await query(`INSERT INTO logs(user_id, log_time, log_type) VALUES ((SELECT user_id FROM users WHERE user_discord_id=`+userId+`), `+logTime+`, (SELECT type_id FROM types WHERE type_description='`+logType+`'));`);
  return resCreate;
}

async function getCurrentAmount(userId, type) {
  const res = await query(`SELECT * FROM logs WHERE user_id=(SELECT user_id FROM users WHERE user_discord_id=`+userId+`) AND log_type=(SELECT type_id FROM types WHERE type_description='`+type+`');`);
  return res.rowCount;
}

async function getRecordByUserId(userId) {
  const res = await query();
} 

async function getDiscordIdByRecordUserId(userId) {
  const res = await query(`
    SELECT user_discord_id FROM users WHERE user_id=`+userId+`;`
  );
  return res.rows[0].user_discord_id;
}

async function getOverallLeaderboardByTypeAndTime(type, timeframe){
  let timeFilter = "";
  if (timeframe === "week") {
    timeFilter = "AND log_time >= EXTRACT(EPOCH FROM (NOW() - INTERVAL '7 days'))";
  } else if (timeframe === "month") {
    timeFilter = "AND log_time >= EXTRACT(EPOCH FROM (NOW() - INTERVAL '1 month'))";
  } 
  const sql = `
    SELECT user_id, COUNT(*) AS log_count
    FROM logs
    WHERE log_type = (
        SELECT type_id FROM types WHERE type_description = '`+type+`'
    )
    ${timeFilter}
    GROUP BY user_id
    ORDER BY log_count DESC;
    `;
  const resLeaderboardList = await query(sql);
  return resLeaderboardList;
}

async function incrementChatScore(message) {
    await checkUserSafe(message, message.author.id);

    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const userResult = await client.query(
            `SELECT user_id
             FROM users
             WHERE user_discord_id = $1`,
            [message.author.id]
        );

        const userId = userResult.rows[0].user_id;

        let scoreResult = await client.query(
            `SELECT chat_score, messages_sent, progress
             FROM chatscores
             WHERE user_id = $1
             FOR UPDATE`,
            [userId]
        );

        if (scoreResult.rows.length === 0) {
            await client.query(
                `INSERT INTO chatscores
                (user_id, chat_score, messages_sent, progress)
                VALUES ($1, 0, 0, 0)`,
                [userId]
            );

            scoreResult = {
                rows: [{
                    chat_score: 0,
                    messages_sent: 0,
                    progress: 0
                }]
            };
        }

        let level = scoreResult.rows[0].chat_score;
        let messagesSent = scoreResult.rows[0].messages_sent;
        let progress = scoreResult.rows[0].progress;

        messagesSent++;
        progress++;

        const required = 10 * Math.pow(1.5, level);

        let levelUp = false;

        if (progress >= required) {
            level++;
            progress = 0;
            levelUp = true;
        }

        await client.query(
            `UPDATE chatscores
             SET
                chat_score = $1,
                messages_sent = $2,
                progress = $3
             WHERE user_id = $4`,
            [level, messagesSent, progress, userId]
        );

        await client.query("COMMIT");

        return {
            levelUp,
            newLevel: level,
            progress,
            required,
            messagesSent
        };

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { 
  query,
  getRecordByUserId,
  doesUserExist,
  createUserRecord,
  createLogRecord,
  getCurrentAmount,
  getOverallLeaderboardByTypeAndTime,
  getDiscordIdByRecordUserId,
  incrementChatScore
} 