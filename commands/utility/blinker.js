const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const fileName = './scores.json';
const file = require(fileName);
const db = require("../../db.js");


module.exports = {
	data: new SlashCommandBuilder().setName('blinker').setDescription('log a blinker with blinkerbot !!'),
	async execute(interaction) {
		const userId = interaction.user.id;
		const record = await db.query("SELECT score FROM scores WHERE userId=\""+userId+"\"");
		console.log(record);
		if (record.length===0) {
			await db.query("INSERT INTO scores (userId, score) VALUES (\""+userId+"\",1);");
			await interaction.reply("New competetor! "+interaction.user.displayName+ " has joined");
		} else {
			await db.query("UPDATE scores SET score = score +1 WHERE userId= \""+userId+"\";");
			await interaction.reply(interaction.user.displayName +"'s blinkers: "+(record[0].score+1));
		}
	},
};