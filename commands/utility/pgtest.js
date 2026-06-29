const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db.js");
const dbconf = require("../../db.json");
const tools = require("../../tools.js");
const pkg = require("../../package.json");

module.exports = {
	data: new SlashCommandBuilder().setName('pgtest').setDescription('get your score'),
	async execute(interaction) {
		const userId = interaction.user.id;
		let response = await db.query(`select * from info;`);
		let responseMessage = '';
		responseMessage = responseMessage + 'Version: ' + pkg.version + '\n';
		responseMessage = responseMessage + 'Build: ' + response.rows[0].build + '\n';
		responseMessage = responseMessage + 'Database Server: ' + dbconf.host + '\n';
		responseMessage = responseMessage + 'Schema: ' + dbconf.schema + '\n';
		responseMessage = responseMessage + 'Application Server: 172.25.15.2\n';
		console.log(response);
		await interaction.reply(responseMessage);
	}, 
};