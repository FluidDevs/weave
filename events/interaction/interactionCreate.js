const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const commands = ["dj-set", "config", "help", "commands", "stats"];
    const adminCommands = ["eval", "player-announce", "reboot"];

    const command = client.commands.get(interaction.commandName);

    if (adminCommands.includes(interaction?.commandName)) {
      const adminCommand = client.adminCommands.get(interaction.commandName);
      return adminCommand.execute(interaction, client);
    }

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

    const botMissingPermissions = [];
    for (const perm of command.botPermissions) {
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

    if (!commands.includes(command?.name)) {
      if (
        interaction.member.permissions.has(PermissionFlagsBits.Administrator)
      ) {
        return command.execute(interaction, client);
      }

      if (!client.djConfig.get(interaction.guild.id)?.enabled)
        return command.execute(interaction, client);

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

      return command.execute(interaction, client);
    }

    return command.execute(interaction, client);
  },
};
