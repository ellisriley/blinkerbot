const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
    data: new SlashCommandBuilder().setName('dbdump').setDescription('ADMIN: DUMP DATABASE TO CHAT'),
    async execute(interaction) {
        let result = await db.query("SELECT * FROM scores;");
        let response = "";
        for (rec in result) {
            response = response + rec[0] + " " + rec[1][0] + " " + rec[2][0] + " " + rec[3][0] +"\n";
        }

        await interaction.reply(response);
    },
};