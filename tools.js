const { GuildMember, CommandInteraction} = require('discord.js');
const db = require("./db.js");

const logTypes = {
  blinker:"blinkers",
  joint:"joints",
  bong:"bongs",
  edible:"edibles",
  vape:"vapes"
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

async function generateResponse(category, amount, nickname) {
  let responseString = "";
  if ((amount%25) ===0) {
    let responses = await db.getMilestoneResponses();
    return responses[0].response;
  }else {
    switch (category){
      case (logTypes.blinker):
        responseString = nickname + " just hit a blinker! Current blinkers: " + amount;
        break;
      case (logTypes.joint):
        responseString = nickname + " just smoked a j! Current j's: " + amount;
        break;
      case (logTypes.edible):
        responseString = nickname + " just hit scranned an edible! Current edibles: " + amount;
        break;
      case (logTypes.bongs):
        responseString = nickname + " just hit smoked a bong! Current edibles: " + amount;
        break;
      case (logTypes.vape):
        responseString = nickname + " just hit hit a vape! Current bowls: " + amount;
        break;
    }
  }
  return responseString;
}

module.exports = {getMemberDisplayNameFromId, logTypes, generateResponse}