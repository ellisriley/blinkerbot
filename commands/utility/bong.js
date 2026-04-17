const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
	data: new SlashCommandBuilder().setName('bong').setDescription('log a rong bip with blinkerbot !!'),
	async execute(interaction) {
			const userId = interaction.user.id;
			const nickname = await tools.getMemberDisplayNameFromId(interaction, userId);
			if (!await db.doesRecordExist(userId)) {
				console.log("creating record");
				await db.createRecord(userId);
				await db.increment(userId, tools.logTypes.bong);
				await interaction.reply("New competetor! "+nickname+ " has joined");
			} else {
				const record = await db.getRecordByUserId(userId);
				await db.increment(userId, tools.logTypes.bong);
				await interaction.reply(nickname +" just ripped a bong! Current score: "+(record[0].bongs+1));
			}
		},
};