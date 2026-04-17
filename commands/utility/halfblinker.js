const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
	data: new SlashCommandBuilder().setName('halfblinker').setDescription('log half a blinker with blinkerbot !!'),
	async execute(interaction) {
			const userId = interaction.user.id;
			const nickname = await tools.getMemberDisplayNameFromId(interaction, userId);
			if (!await db.doesRecordExist(userId)) {
				await db.createRecord(userId);
				await db.incrementByHalf(userId, tools.logTypes.blinker);
				await interaction.reply("New competetor! "+nickname+ " has joined");
			} else {
				const record = await db.getRecordByUserId(userId);
				await db.incrementByHalf(userId, tools.logTypes.blinker);
				await interaction.reply(nickname +" just hit half a blinker! Current score: "+(record[0].blinkers+0.5));
			}
		},
};