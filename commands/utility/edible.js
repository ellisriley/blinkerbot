const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
	data: new SlashCommandBuilder().setName('edible').setDescription('log an edible with blinkerbot !!'),
	async execute(interaction) {
			const userId = interaction.user.id;
			const nickname = await tools.getMemberDisplayNameFromId(interaction, userId);
			if (!await db.doesRecordExist(userId)) {
				console.log("creating record");
				await db.createRecord(userId);
				await db.increment(userId, tools.logTypes.edible);
				await interaction.reply("New competetor! "+nickname+ " has joined");
			} else {
				const record = await db.getRecordByUserId(userId);
				await db.increment(userId, tools.logTypes.edible);
				await interaction.reply(nickname +" just scranned an edible! Current score: "+(record[0].edibles + 1));
			}
		},
};