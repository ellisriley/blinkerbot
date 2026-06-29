const { SlashCommandBuilder } = require("discord.js");
const db = require("../../db.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("colour")
        .setDescription("Choose your name colour")
        .addStringOption(option =>
            option
                .setName("role")
                .setDescription("Choose a colour")
                .setAutocomplete(true)
                .setRequired(true)
        ),

    async autocomplete(interaction) {

        const focused = interaction.options.getFocused().toLowerCase();

        const selfRoles = await db.getSelfRoles();

        const choices = selfRoles
            .map(r => interaction.guild.roles.cache.get(r.role_id))
            .filter(role => role)
            .filter(role =>
                role.name.toLowerCase().includes(focused)
            )
            .slice(0, 25);

        await interaction.respond(
            choices.map(role => ({
                name: role.name,
                value: role.id
            }))
        );

    },

    async execute(interaction) {

        const roleId = interaction.options.getString("role");

        if (!(await db.isSelfRole(roleId))) {

            return interaction.reply({
                content: "That role isn't self assignable.",
                ephemeral: true
            });

        }

        const selfRoles = await db.getSelfRoles();

        const rolesToRemove = selfRoles
            .map(r => r.role_id)
            .filter(id => interaction.member.roles.cache.has(id));

        if (rolesToRemove.length > 0) {
            await interaction.member.roles.remove(rolesToRemove);
        }

        await interaction.member.roles.add(roleId);

        const role = interaction.guild.roles.cache.get(roleId);

        await interaction.reply({
            content: `Your colour is now **${role.name}**.`,
            ephemeral: true
        });

    }

};