const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
	data: new SlashCommandBuilder().setName('pgtest').setDescription('get your score'),
	async execute(interaction) {
		let response = await db.getRecordByUserId("0");

		await interaction.reply(response);
	},
};