const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  id: "djConfig",
  permission: [PermissionFlagsBits.Administrator],
  botPermissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.AttachFiles,
  ],

  async execute(interaction, client) {
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("enableDjRole")
          .setStyle(ButtonStyle.Success)
          .setLabel("Enable"),
        new ButtonBuilder()
          .setCustomId("disableDjRole")
          .setStyle(ButtonStyle.Danger)
          .setLabel("Disable")
      ),
      mainEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("DJ Role Config")
        .setDescription(
          "Execute **/dj-set** to set the DJ role. When enabled only members with this role or above can use Weave in your server. Enable and disable the use of the DJ Role with the buttons."
        )
        .setTimestamp();

    interaction.reply({
      embeds: [mainEmbed],
      components: [row],
      ephemeral: true,
    });
  },
};
