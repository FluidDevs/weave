const { EmbedBuilder,PermissionFlagsBits } = require("discord.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client();

module.exports = {
  name: "lyrics",
  description: "Lyrics for the current song.",
  botPermissions: ["SendMessages", "EmbedLinks"],

  async execute(interaction, client) {

    const { options, member, guild } = interaction;

    const VoiceChannel = member.voice.channel;

    if (!VoiceChannel)
    return interaction.reply({
      content:
        "🔸 |  You aren't in a voice channel. Join one to be able find the lyrics.",
      ephemeral: true,
    });

    const player = client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: member.voice.channel.id,
      textChannel: interaction.channelId,
      selfDeafen: true,
    });

    if (!player.playing && !player.paused)
      return interaction.reply({
        content: "🔸 |  There is nothing in the queue.",
        ephemeral: true,
      });

    if (player.paused)
      return interaction.reply({
        content: "🔸 |  Resume the player to view the lyrics.",
        ephemeral: true,
      });

    await interaction.deferReply();

    try {
      const track = player.queue.current;
      const trackTitle = track.title
        .replace("(Official Video)", "")
        .replace("(Official Audio)", "");
      const actualTrack = await gClient.songs.search(trackTitle);
      const searches = actualTrack[0];
      const lyrics = await searches.lyrics();

      const lyricsEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`🔹 |  Lyrics for **${trackTitle}**`)
        .setDescription(lyrics)
        .setTimestamp();
      return interaction.followUp({
        embeds: [lyricsEmbed],
      });
    } catch (error) {
      return interaction.followUp({
        content: "🔸 |  No lyrics found for this song.",
        ephemeral: true,
      });
    }
  },
};
