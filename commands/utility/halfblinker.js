const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
	data: new SlashCommandBuilder().setName('halfblinker').setDescription('log half a blinker with blinkerbot !!'),
	async execute(interaction) {
		const userId = interaction.user.id;
		const record = await db.query("SELECT score FROM scores WHERE userId=\""+userId+"\"");
		const nickname = await tools.getMemberDisplayNameFromId(interaction, userId);
		//console.log(record);
		if (record.length===0) {
			await db.query("INSERT INTO scores (userId, score) VALUES (\""+userId+"\",0.5);");
			await interaction.reply("New competetor! "+nickname+ " has joined");
		} else {
			await db.query("UPDATE scores SET score = score +0.5 WHERE userId= \""+userId+"\";");
			await interaction.reply(nickname +" just hit half a blinker! Current score: "+(record[0].score+0.5));
		}
	},
};