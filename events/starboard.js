const { EmbedBuilder } = require("discord.js");
const db = require("../db");

module.exports = {
    name: "messageReactionAdd",

    async execute(reaction, user) {
        try {
            // Ignore bot reactions
            console.log("got star");
            if (user.bot) return;

            // Fetch partials if needed
            if (reaction.partial) {
                await reaction.fetch();
            }

            const message = reaction.message;

            // Only handle ⭐
            if (reaction.emoji.name !== "⭐") return;
            // Get starboard settings
            const starChannelId = await db.getConfig("star_channel");
            const threshold = Number(await db.getConfig("star_threshold")) || 1;

            if (!starChannelId) return;

            // Don't star messages already in starboard
            if (message.channel.id === starChannelId) return;


            // Check reaction count
            const starCount = reaction.count;

            if (starCount < threshold) return;


            // Check if message already exists in starboard
            const starboardChannel = await message.guild.channels.fetch(starChannelId);

            if (!starboardChannel) return;
            if (await db.messageHasBeenStarred()) return;
            console.log("Not alreayd in tabel");
            db.addStarredMessage(reaction.message.id);

            // Create embed
            const embed = new EmbedBuilder()
                .setColor("Gold")
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL()
                })
                .setDescription(message.content || "*No text content*")
                .addFields(
                    {
                        name: "Original",
                        value: `[Jump to message](${message.url})`
                    },
                    {
                        name: "Stars",
                        value: `⭐ ${starCount}`,
                        inline: true
                    }
                )
                .setTimestamp(message.createdAt);


            // Attach images if present
            if (message.attachments.size > 0) {
                embed.setImage(
                    message.attachments.first().url
                );
            }


            await starboardChannel.send({
                embeds: [embed]
            });


        } catch (err) {
            console.error("Starboard error:", err);
        }
    }
};