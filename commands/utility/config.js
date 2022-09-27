const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "config",
    description: "Configure Weave.",
    userPermissions: ["Administrator"],
    botPermissions: ["SendMessages", "EmbedLinks"],

    async execute(interaction, client) {

        mainEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`${interaction.guild.name}'s Config`)
        .setDescription("Please select from the buttons below to configure the following.")
        .setTimestamp()
        
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('djConfig') //DONE
            .setStyle(ButtonStyle.Danger)
            .setLabel('DJ Role'),
        )

        interaction.reply({ embeds: [mainEmbed], components: [row], ephemeral: true})
    }
}