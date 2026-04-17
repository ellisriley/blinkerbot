const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
	data: new SlashCommandBuilder().setName('joint').setDescription('log a joint with blinkerbot !!'),
	async execute(interaction) {
			const userId = interaction.user.id;
			const nickname = await tools.getMemberDisplayNameFromId(interaction, userId);
			if (!await db.doesRecordExist(userId)) {
				console.log("creating record");
				await db.createRecord(userId);
				await db.increment(userId, tools.logTypes.joint);
				await interaction.reply("New competetor! "+nickname+ " has joined");
			} else {
				const record = await db.getRecordByUserId(userId);
				await db.increment(userId, tools.logTypes.joint);
				await interaction.reply(nickname +" just smoked a joint! Current score: "+(record[0].joints+1));
			}
		},
};