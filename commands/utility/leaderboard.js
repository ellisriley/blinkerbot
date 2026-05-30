const tools = require("../../tools.js");
const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");


module.exports = {
    data: new SlashCommandBuilder().setName('leaderboard').setDescription('view the blinker leaderboard !!').addStringOption((option) =>
			option
				.setName('category')
				.setDescription('type of weed to show the leaderboard for')
				.setRequired(true)
				.addChoices(
					{ name: 'blinkers', value: 'blinkers' },
					{ name: 'joints', value: 'joints' },
					{ name: 'bongs', value: 'bongs' },
                    { name: 'edibles', value: 'edibles' },
				),
		),
    async execute(interaction) {
        const category = interaction.options.getString("category");
        const records = await db.query("SELECT * FROM scores ORDER BY " + category +" DESC LIMIT 6;");
        //console.log(records);
        let response = "";
        for (record in records) {
            let displayName = await tools.getMemberDisplayNameFromId(interaction, records[record].userId);
            
            switch (record) {
                case "0":
                    response = response + "🥇. " + displayName + ": " + records[record][category] + " " + category +"\n"; 
                    
                    break;
                case "1":
                    response = response + "🥈. " + displayName + ": " + records[record][category] + " " + category +"\n"; 
                    break;
                case "2":
                    response = response + "🥉. " + displayName + ": " + records[record][category] + " " + category +"\n"; 
                    break;
                default:
                    //console.log("default"+record + displayName);
                    response = response + (parseInt(record) + 1) + ". " + displayName + ": " + records[record][category] + " " + category +"\n";
                    break;
            }
            if (record === 0) {

            }
             
        }
        await interaction.reply(response);
    },
};