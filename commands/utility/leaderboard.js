const tools = require("../../tools.js");
const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");

async function getMemberDisplayNameFromId(interaction, userId) {
    if (!interaction.guild) {
        console.log("No guild");
        return undefined;
    }
  
    let member = interaction.guild.members.cache.get('1357073835752689794');
    console.log("getting user " + member);
    if (!member) {
      try {
        console.log("member is" + member);
        member = await interaction.guild.members.fetch('1357073835752689794');
        
      } catch {
        return "Unknown";
      }
    }
    
    return member?.displayName ?? member?.user?.username;
}

module.exports = {
    data: new SlashCommandBuilder().setName('leaderboard').setDescription('view the blinker leaderboard !!'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const records = await db.query("SELECT * FROM scores ORDER BY score DESC;");
        console.log(records);
        for (record in records) {
            console.log(await getMemberDisplayNameFromId(interaction, record.userId));
        }
        await interaction.reply("." +records);
    },
};