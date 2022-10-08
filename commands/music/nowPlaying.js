const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("np")
    .setDescription("See the current playing song."),

  async execute(interaction, client) {
    function msToTime(duration) {
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      return minutes + ":" + seconds;
    }

    if (await musicChecker.vc(interaction)) return;

    const player = client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: interaction.member.voice.channel.id,
        textChannel: interaction.channelId,
        selfDeafen: true,
        volume: 50
    });
    
    if (await musicChecker.playing(interaction, player, true)) return;

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
