const tools = require("../../tools.js");
const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");

async function getMemberDisplayNameFromId(interaction, userId) {
    if (!interaction.guild) {
        console.log("No guild");
        return undefined;
    }
  
    let member = await interaction.guild.members.cache.get(userId);
    //console.log(userId);
    //console.log("getting user " + member + " with id " + userId);
    if (!member) {
      try {
        //console.log("member is" + member);
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
        console.log(records);
        for (record in records) {
            let displayName = await getMemberDisplayNameFromId(interaction, records[record].userId);
            //console.log("User ID from record is " + records[record].userId);
            //console.log("Display name : " + displayName);
            response = response + record + ". " + displayName + " : " + records[record].score + "\n"; 
        }
        await interaction.reply(response);
    },
};