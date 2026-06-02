const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
    data: new SlashCommandBuilder().setName('join').setDescription('join opt-in channels').addStringOption((option) =>
            option
                .setName('role')
                .setDescription('role to join')
                .setRequired(true)
                .addChoices(
                    { name: 'pol', value: "1499786790293209118" },
                    { name: 'vents', value: "1502347205296783480" },
                    { name: 'stoners', value: "1493704080831549500" },
                    { name: 'gamers', value: '1493677618736791743'}
                )
        ),
    async execute(interaction) {
        let roleId = interaction.options.getString('role');
        await interaction.member.roles.add(roleId);
        await interaction.reply('Added role!');
    },
};