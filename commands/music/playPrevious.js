const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play-previous")
    .setDescription("Play the previous song and skip the current song."),

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

    res = await player.search(player.queue.previous.uri, interaction.user);

    if (player.state !== "CONNECTED") player.connect();
    player.queue.add(res.tracks[0]);
    await player.stop();
    player.pause(false);
    if (
      !player.playing &&
      !player.paused &&
      player.queue.totalSize === res.tracks.length
    )
      player.play();

    const playPrevious = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(`🔹 | Playing the previous song [${interaction.member}]`)
      .setTimestamp();
    return interaction.reply({
      embeds: [playPrevious],
    });
  },
};
