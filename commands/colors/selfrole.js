const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const db = require("../../db.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("selfrole")
        .setDescription("Manage self assignable roles")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)

        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a self assignable role")
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("Role to add")
                        .setRequired(true)
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a self assignable role")
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("Role to remove")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {

        const subcommand = interaction.options.getSubcommand();
        const role = interaction.options.getRole("role");

        if (subcommand === "add") {

            await db.addSelfRole(role.id);

            return interaction.reply({
                content: `${role.name} is now self assignable.`,
            });

        }

        if (subcommand === "remove") {

            await db.removeSelfRole(role.id);

            return interaction.reply({
                content: `${role.name} is no longer self assignable.`,
            });

        }

    }
};