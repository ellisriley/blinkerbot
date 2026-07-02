const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
    data: new SlashCommandBuilder().setName('log').setDescription('log a hit with blinky !!').addStringOption((option) =>
			option
				.setName('category')
                .setDescription('type of log')
				.setRequired(true)
				.addChoices(
					{ name: 'blinker', value: tools.logTypes.blinker },
					{ name: 'joint', value: tools.logTypes.joint },
					{ name: 'bong', value: tools.logTypes.bong },
                    { name: 'edible', value: tools.logTypes.edible },
                    { name: 'vape', value: tools.logTypes.vape }
				)
		).addIntegerOption((option) => option
                .setName('amount')
                .setDescription('amount of logs to create')
                .setRequired(false)
            ),
    async execute(interaction) {
        const userId = interaction.user.id;
        const category = interaction.options.getString("category");
        const amount = interaction.options.getInteger('amount')||1;
        let result;
        //console.log(amount);
        if (amount === 1) {
            result = await db.createLogRecord(interaction, userId, category);
        } else {
            result = await db.createMultipleLogRecords(interaction, userId, category, amount);
        }
        interaction.reply(await tools.generateResponse(category, await db.getCurrentAmount(userId, category), await tools.getMemberDisplayNameFromId(interaction, userId))); 
        //interaction.reply("fg");
    },
};