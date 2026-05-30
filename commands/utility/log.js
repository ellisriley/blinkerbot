const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
    data: new SlashCommandBuilder().setName('log').setDescription('log a hit with blinky !!').addStringOption((option) =>
			option
				.setName('category')
				.setDescription('type of weed to show the leaderboard for')
				.setRequired(true)
				.addChoices(
					{ name: 'blinker', value: tools.logTypes.blinker },
					{ name: 'joint', value: tools.logTypes.joint },
					{ name: 'bong', value: tools.logTypes.bong },
                    { name: 'edible', value: tools.logTypes.edible },
                    { name: 'vape', value: tools.logTypes.vape }
				)
		),
    async execute(interaction) {
        const userId = interaction.user.id;
        const nickname = await tools.getMemberDisplayNameFromId(interaction, userId);
        const category = interaction.options.getString("category");
        if (!await db.doesRecordExist(userId)) {
            await db.createRecord(userId);
            await db.increment(userId, category);
            await interaction.reply("New competetor! "+nickname+ " has joined");
        } else {
            const record = await db.getRecordByUserId(userId);
            await db.increment(userId, category);
            let response = await tools.generateResponse(category, (record[0][category]+1), nickname);
            await interaction.reply(response);
        }
    },
};