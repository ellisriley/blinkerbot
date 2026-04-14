const tools = require("../../tools.js");
const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");

async function getMemberDisplayNameFromId(interaction, userId) {
    if (!interaction.guild) {
        console.log("No guild");
        return undefined;
    }
  
    let member = await interaction.guild.members.cache.get(userId);
    if (!member) {
      try {
        member = await interaction.guild.members.fetch(userId);
        
      } catch {
        return "Unknown";
      }
    }
    
    return member?.displayName ?? member?.user?.username;
}

module.exports = {
    data: new SlashCommandBuilder().setName('leaderboard').setDescription('view the blinker leaderboard !!'),
    async execute(interaction) {
        const records = await db.query("SELECT * FROM scores ORDER BY score DESC LIMIT 3;");
        let response = "";
        for (record in records) {
            let displayName = await getMemberDisplayNameFromId(interaction, records[record].userId);
            response = response + record + ". " + displayName + ": " + records[record].score + " blinkers\n"; 
        }
        await interaction.reply(response);
    },
};