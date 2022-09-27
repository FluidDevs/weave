const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "play-previous",
  description: "Play the previous song and skip the current song.",
  botPermissions: ["SendMessages", "EmbedLinks"],

  async execute(interaction, client) {
    const { options, member, guild } = interaction;

    const VoiceChannel = member.voice.channel;

    if (!VoiceChannel)
      return interaction.reply({
        content:
          "🔸 |  You aren't in a voice channel. Join one to be able to play music! Already in a voice channel? Make sure I have permission to see it.",
        ephemeral: true,
      });

    if (
      guild.members.me.voice.channelId &&
      VoiceChannel.id !== guild.members.me.voice.channelId
    )
      return interaction.reply({
        content: `🔸 |  I'm already playing music in <#${guild.me.voice.channelId}>.`,
        ephemeral: true,
      });

    const player = client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: member.voice.channel.id,
      textChannel: interaction.channelId,
      selfDeafen: true,
      volume: 50,
    });

    if (!player.playing && !player.paused)
      return interaction.reply({
        content: "🔸 |  There is nothing in the queue.",
        ephemeral: true,
      });

    if (!player.queue.previous.uri)
      return interaction.reply({
        content: "🔸 |  There is no previous song.",
        ephemeral: true,
      });

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
      .setDescription(`🔹 | Playing the previous song [${member}]`)
      .setTimestamp();
    return interaction.reply({
      embeds: [playPrevious],
    });
  },
};
