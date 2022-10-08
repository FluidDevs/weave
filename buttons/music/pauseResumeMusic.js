const { EmbedBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  id: "pauseResumeMusic",

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

    if (player.paused) {
      await player.pause(false);
      const pauseEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`🔹 | Resumed [${interaction.member}]`)
        .setTimestamp();
      await interaction.reply({
        embeds: [pauseEmbed],
      });
      await wait(2000);
      return interaction.deleteReply();
    }

    await player.pause(true);

    const pauseEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(`🔹 | Paused [${interaction.member}]`)
      .setTimestamp();
    await interaction.reply({
      embeds: [pauseEmbed],
    });

    await wait(2000);
    interaction.deleteReply();
  },
};
