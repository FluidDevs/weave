const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rewind")
    .setDescription("Rewind a certain amount of seconds backwards.")
    .addIntegerOption((option) => option.setName("seconds").setDescription("Seconds to rewind.").setRequired(true)),

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

    const rewindAmount = interaction.options.getInteger("seconds");

    let seektime = player.position - Number(rewindAmount) * 1000;

    if (
      seektime >= player.queue.current.duration - player.position ||
      seektime < 0
    ) {
      seektime = 0;
    }

    player.seek(Number(seektime));

    const rewindEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(
        `🔹 |  Rewound **${rewindAmount}s** backwards [${interaction.member}]`
      )
      .setTimestamp();
    return interaction.reply({
      embeds: [rewindEmbed],
    });
  },
};
