const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current song."),

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

    await player.pause(true);

    const pauseEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(`🔹 | Paused [${interaction.member}]`)
      .setTimestamp();
    return interaction.reply({
      embeds: [pauseEmbed],
    });
  },
};
