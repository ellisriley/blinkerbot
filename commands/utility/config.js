const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const db = require("../../db.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Configure Blinky")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addSubcommand(sub =>
            sub
                .setName("channel")
                .setDescription("Configure a channel setting")

                .addStringOption(option =>
                    option
                        .setName("setting")
                        .setDescription("Setting")
                        .setAutocomplete(true)
                        .setRequired(true)
                )

                .addChannelOption(option =>
                    option
                        .setName("value")
                        .setDescription("Channel")
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("integer")
                .setDescription("Configure an integer setting")

                .addStringOption(option =>
                    option
                        .setName("setting")
                        .setDescription("Setting")
                        .setAutocomplete(true)
                        .setRequired(true)
                )

                .addIntegerOption(option =>
                    option
                        .setName("value")
                        .setDescription("Value")
                        .setRequired(true)
                )
        ),

    async autocomplete(interaction) {

        const subcommand = interaction.options.getSubcommand();

        const focused = interaction.options
            .getFocused()
            .toLowerCase();

        const settings = await db.getConfigByType(subcommand);

        const choices = settings
            .filter(setting =>
                setting.name
                    .toLowerCase()
                    .includes(focused)
            )
            .slice(0, 25);

        await interaction.respond(
            choices.map(setting => ({
                name: `${setting.name} - ${setting.description}`,
                value: setting.name
            }))
        );

    },

    async execute(interaction) {

        const subcommand = interaction.options.getSubcommand();

        const setting = interaction.options.getString("setting");

        if (subcommand === "channel") {

            const channel = interaction.options.getChannel("value");

            await db.setConfig(setting, channel.id);

            return interaction.reply({
                content: `✅ **${setting}** updated to ${channel}.`,
                ephemeral: true
            });

        }

        if (subcommand === "integer") {

            const value = interaction.options.getInteger("value");

            await db.setConfig(setting, value);

            return interaction.reply({
                content: `✅ **${setting}** updated to **${value}**.`,
                ephemeral: true
            });

        }

    }

};