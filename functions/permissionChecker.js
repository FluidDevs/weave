const { EmbedBuilder } = require("discord.js")

async function user (interaction, command) {
  if (
    !interaction.channel
      .permissionsFor(interaction.member)
      .has(command.userPermissions || [])
  )
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `🔸 |  You are missing permission(s): \`${command.userPermissions}\`.`
          ),
      ],
      ephemeral: true,
    });
}

async function bot (interaction) {
    const botPermissions = ["SendMessages", "EmbedLinks", "ManageMessages", "AttachFiles"];
    
    const botMissingPermissions = [];

    for (const perm of botPermissions) {
      if (
        !interaction.channel
          .permissionsFor(interaction.guild.members.me)
          .has(perm)
      ) {
        botMissingPermissions.push(perm);
      }
    }
    if (botMissingPermissions.length > 0)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `🔸 |  Weave is missing permission(s): \`${botMissingPermissions}\`.`
            ),
        ],
        ephemeral: true,
      });
}

module.exports = { user, bot };