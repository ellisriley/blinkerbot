const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const tools = require("../../tools.js");

module.exports = {
    data: new SlashCommandBuilder().setName('vape').setDescription('log a vape with blinkerbot !!'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const nickname = await tools.getMemberDisplayNameFromId(interaction, userId);
        if (!await db.doesRecordExist(userId)) {
            await db.createRecord(userId);
            await db.increment(userId, tools.logTypes.vape);
            await interaction.reply("New competetor! "+nickname+ " has joined");
        } else {
            const record = await db.getRecordByUserId(userId);
            await db.increment(userId, tools.logTypes.vape);
            if (record[0].vapes===24){
                await interaction.reply(nickname + " is on their way to 100 fr. Current vape rips: "+(record[0].vapes+1)+"\n @everyone");
            } else if (record[0].vapes===49){
                await interaction.reply("woah " + nickname+ " is halfway there! Current vape rips: "+(record[0].vapes+1)+"\n @everyone");
            } else if (record[0].vapes===99){
                await interaction.reply("woah " + nickname+ " is halfway there! Current vape rips: "+(record[0].vapes+1)+"\n @everyone");
            } 
            else {
                await interaction.reply(nickname +" just hit the vape! Current score: "+(record[0].vapes+1));
            }
        }
    },
};