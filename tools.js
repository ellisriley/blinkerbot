const { GuildMember, CommandInteraction} = require('discord.js');

const types = {
  blinker="blinkers",
  joint="joints",
  bong="bongs",
  edible="edible",
  vape="vapes"
};

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


module.exports = {getMemberDisplayNameFromId}