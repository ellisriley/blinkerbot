const fs = require('node:fs');
const path = require('node:path');
const tools = require('./tools.js');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags, Partials } = require('discord.js');
const { token } = require('./config.json');
const db = require("./db.js")


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMessageReactions],partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ] });
console.log("Starting");
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection(); 


const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


client.on(Events.InteractionCreate, async (interaction) => {
    
	if (interaction.isAutocomplete()) {

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command || !command.autocomplete)
			return;

		return command.autocomplete(interaction);
		
	}
	
	if (!interaction.isChatInputCommand()) return; 
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;


    try {
        const result = await db.incrementChatScore(message);

        if (result.levelUp) {
            await message.channel.send({
                content: `🎉 Congratulations ${message.author}! You reached **Chat Level ${result.newLevel}**!`
            });
        }

    } catch (err) {
        console.error(err);
    }
});

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath)
    .filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }

    console.log(`Loaded event: ${event.name}`);
}

client.login(token);