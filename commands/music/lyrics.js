const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");
const genius = require("genius-lyrics");
const gClient = new genius.Client();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Lyrics for the current song."),
    
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
