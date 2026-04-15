const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
	data: new SlashCommandBuilder().setName('myscore').setDescription('get your score'),
	async execute(interaction) {
		const userId = interaction.user.id;
        const nickname = await tools.getMemberDisplayNameFromId(interaction, userId);
		const record = await db.getRecordByUserId(userId);
		let response = nickname + "'s score\n";
		response = response + "Blinkers: " + record[0].blinkers +"\n";
		response = response + "Bongs: " + record[0].bongs +"\n";
		response = response + "Joints: " + record[0].joints +"\n";
		response = response + "Edibles: " + record[0].edibles +"\n";

		await interaction.reply(response);
	},
};