const tools = require("../../tools.js");
const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");


module.exports = {
    data: new SlashCommandBuilder().setName('masslog').setDescription('ammend your record with a given amount').addStringOption((option) =>
            option
                .setName('category')
                .setDescription('type of weed to show the leaderboard for')
                .setRequired(true)
                .addChoices(
                    { name: 'blinkers', value: 'blinkers' },
                    { name: 'joints', value: 'joints' },
                    { name: 'bongs', value: 'bongs' },
                    { name: 'edibles', value: 'edibles' },
                ),
        ).addIntegerOption(option =>
            option.setName("amount")
            .setDescription("amount of hits to log")
            .setMinValue(-22)
            .setMaxValue(22)
            .setRequired(true)
        ),
    async execute(interaction) {
        const userId = interaction.user.id;
        const category = interaction.options.getString("category");
        const amount = interaction.options.getInteger("amount");
        const nickname = await tools.getMemberDisplayNameFromId(interaction, userId);
        const record = await db.getRecordByUserId(userId);
        await db.ammend(userId, category, amount);
        await interaction.reply("Records ammended!");
    },
};