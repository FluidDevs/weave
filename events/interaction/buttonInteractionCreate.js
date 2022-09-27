const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const buttons = ["enableDjRole", "disableDjRole", "djConfig"]; // Commands Array

    if (!interaction.isButton()) return;

    const button = client.buttons.get(interaction.customId);

    if (
      button.permission &&
      !interaction.member.permissions.has(button.permission)
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `🔸 |  You are missing permission(s): \`${button.permission}\`.`
            ),
        ],
        ephemeral: true,
      });

    const botMissingPermissions = [];
    for (const perm of button.botPermissions) {
      if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(perm)) {
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

    if (button.ownerOnly && interaction.member.id !== interaction.guild.ownerId)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`🔸 |  Required permission: OWNER ONLY}.`),
        ],
        ephemeral: true,
      });

    if (!buttons.includes(button.id)) {
      if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return button.execute(interaction, client);
      }

      if (!client.djConfig.get(interaction.guild.id))
        return button.execute(interaction, client);

      if (client.djConfig.get(interaction.guild.id).enabled == false) return;

      let role = interaction.guild.roles.cache.find(
        (r) => r.id == client.djConfig.get(interaction.guild.id).djRole
      );

      const ans = role.comparePositionTo(interaction.member.roles.highest);

      if (ans > 0) {
        return interaction.reply({
          content:
            "🔸 |  DJ Mode is enabled, you do not have sufficent permissions.",
          ephemeral: true,
        });
      }

      return button.execute(interaction, client);
    }

    return button.execute(interaction, client);
  },
};
