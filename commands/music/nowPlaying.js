const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "np",
  description: "See the current playing song.",
  botPermissions: ["SendMessages", "EmbedLinks"],

  async execute(interaction, client) {
    function msToTime(duration) {
      var milliseconds = Math.floor((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      return minutes + ":" + seconds;
    }

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

    const track = player.queue.current;

    const npEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Now Playing")
      .setDescription(
        `[${track.title}](${track.uri}) [${
          msToTime(player.queue.current.duration) || "Undetermined"
        } - <@${player.queue.current.requester.id}>]`
      )
      .setTimestamp();
    return interaction.reply({
      embeds: [npEmbed],
    });
  },
};
