const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
	data: new SlashCommandBuilder().setName('myscore').setDescription('get your score'),
	async execute(interaction) {
		const userId = interaction.user.id;
        const nickname = await tools.getMemberDisplayNameFromId(interaction, userId);
		const record = await db.query("SELECT score FROM scores WHERE userId=\""+userId+"\"");
		await interaction.reply(nickname+ "'s current blinker count is " + record[0].score);
	},
};