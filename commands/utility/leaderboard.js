const tools = require("../../tools.js");
const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");


module.exports = {
    data: new SlashCommandBuilder().setName('leaderboard').setDescription('view the blinker leaderboard !!'),
    async execute(interaction) {
        const records = await db.query("SELECT * FROM scores ORDER BY score DESC LIMIT 6;");
        let response = "";
        for (record in records) {
            let displayName = await tools.getMemberDisplayNameFromId(interaction, records[record].userId);
            response = response + record + ". " + displayName + ": " + records[record].score + " blinkers\n"; 
        }
        await interaction.reply(response);
    },
};