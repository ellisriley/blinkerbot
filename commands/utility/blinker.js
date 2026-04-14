const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
	data: new SlashCommandBuilder().setName('blinker').setDescription('log a blinker with blinkerbot !!'),
	async execute(interaction) {
		const userId = interaction.user.id;
		const record = await db.query("SELECT score FROM scores WHERE userId=\""+userId+"\"");
		const nickname = await tools.getMemberDisplayNameFromId(interaction, userId);
		//console.log(record);
		if (record.length===0) {
			await db.query("INSERT INTO scores (userId, score) VALUES (\""+userId+"\",1);");
			await interaction.reply("New competetor! "+nickname+ " has joined");
		} else {
			await db.query("UPDATE scores SET score = score +1 WHERE userId= \""+userId+"\";");
			await interaction.reply(nickname +" just hit a blinker! Current score: "+(record[0].score+1));
		}
	},
};