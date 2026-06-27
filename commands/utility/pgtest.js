const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
	data: new SlashCommandBuilder().setName('pgtest').setDescription('get your score'),
	async execute(interaction) {
		const userId = interaction.user.id;
		let response = await db.createLogRecord(interaction, userId, 'Blinker');
		console.log(response);
		await interaction.reply("executed");
	}, 
};