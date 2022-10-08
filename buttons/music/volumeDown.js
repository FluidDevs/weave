const { EmbedBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  id: "volumeDownMusic",

  async execute(interaction, client) {

    if (await musicChecker.vc(interaction)) return;

    const player = client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: interaction.member.voice.channel.id,
        textChannel: interaction.channelId,
        selfDeafen: true,
        volume: 50
    });
    
    if (await musicChecker.playing(interaction, player)) return;

    const volume = player.volume - 10;

    if (volume < 0 || volume > 100)
      return interaction.reply({
        content: `🔸 |  You can only set the volume from 0 to 100. The volume is currently **${player.volume}%**`,
        ephemeral: true,
      });

    player.setVolume(volume);

    const volumeEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(
        `🔹 |  Volume has been adjusted to **${player.volume}%** [${interaction.member}]`
      )
      .setTimestamp();
    await interaction.reply({
      embeds: [volumeEmbed],
    });
    await wait(2000);
    interaction.deleteReply();
  },
};
