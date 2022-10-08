const { EmbedBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  id: "loopMusic",

  async execute(interaction, client) {
    if (await musicChecker.vc(interaction)) return;

    const player = client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channelId,
      selfDeafen: true,
      volume: 50,
    });

    if (await musicChecker.playing(interaction, player, true)) return;

    const loopEmbed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (!player.trackRepeat && !player.queueRepeat) {
      loopEmbed.setDescription(`🔹 | Looping Song [${interaction.member}]`);
      player.setTrackRepeat(true);

      await interaction.reply({
        embeds: [loopEmbed],
      });

      await wait(2000);
      return interaction.deleteReply();
    }
    if (player.trackRepeat && !player.queueRepeat) {
      loopEmbed.setDescription(`🔹 | Looping Queue [${interaction.member}]`);
      player.setTrackRepeat(false);
      player.setQueueRepeat(true);

      await interaction.reply({
        embeds: [loopEmbed],
      });

      await wait(2000);
      return interaction.deleteReply();
    }
    if (!player.trackRepeat && player.queueRepeat) {
      loopEmbed.setDescription(
        `🔹 | Removed the repeat [${interaction.member}]`
      );
      player.setTrackRepeat(false);
      player.setQueueRepeat(false);

      await interaction.reply({
        embeds: [loopEmbed],
      });

      await wait(2000);
      return interaction.deleteReply();
    }
  },
};
