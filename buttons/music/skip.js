const { EmbedBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  id: "skipMusic",

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

    await player.stop();

    const skipEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(`🔹 |  Skipped [${interaction.member}]`)
      .setTimestamp();

    await interaction.reply({
      embeds: [skipEmbed],
    });
    await wait(2000);
    interaction.deleteReply();
  },
};
