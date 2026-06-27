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
                    { name: 'blinkers', value: 'Blinker' },
                    { name: 'joints', value: 'Joint' },
                    { name: 'bongs', value: 'Bong' },
                    { name: 'edibles', value: 'Edible' },
                    { name: 'vapes', value: "Vape"}
                ),
        ).addStringOption(option =>
            option.setName("time")
            .setDescription("timeframe to show leaderboard for")
            .setRequired(true)
            .addChoices(
                    { name: 'week', value: 'week' },
                    { name: 'month', value: 'month' },
                    { name: 'overall', value: 'overall' }
                ),
        ),
    async execute(interaction) {
        const category = interaction.options.getString("category");
        const timeframe = interaction.options.getString("time");
        const records = await db.getOverallLeaderboardByType(category);
        //console.log(records);
        let response = "";
        let number = 0
        for (record of records.rows) {
            //console.log(record);
            let displayName = await tools.getMemberDisplayNameFromId(interaction, await db.getDiscordIdByRecordUserId(record.user_id));
            number++;
            switch (number) {
                case 1:
                    response = response + "🥇. " + displayName + ": " + record.log_count + " " + category +"\n"; 
                    
                    break;
                case 2:
                    response = response + "🥈. " + displayName + ": " + record.log_count + " " + category +"\n"; 
                    break;
                case 3:
                    response = response + "🥉. " + displayName + ": " + record.log_count + " " + category +"\n"; 
                    break;
                default:
                    //console.log("default"+record + displayName);
                    response = response + (parseInt(record) + 1) + ". " + displayName + ": " + record.log_count + " " + category +"\n";
                    break;
            }
            if (record === 0) {

            }
             
        }
        await interaction.reply(response);
    },
};