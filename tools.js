const { GuildMember, CommandInteraction} = require('discord.js');

async function getMemberDisplayNameFromId(interaction, userId) {
    if (!interaction.guild) {
        console.log("No guild");
        return undefined;
    }
  
    let member = interaction.guild.members.cache.get(userId);
    console.log("getting user");
    if (!member) {
      try {
        member = await interaction.guild.members.fetch(userId);
        
      } catch {
        return "Unknown";
      }
    }
    
    return member?.displayName ?? member?.user?.username;
}

module.exports = {getMemberDisplayNameFromId}