const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");
const util = require("../../functions/erelaUtil.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View the queue."),

  async execute(interaction, client) {

    if (await musicChecker.vc(interaction)) return;

    const player = client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: interaction.member.voice.channel.id,
        textChannel: interaction.channelId,
        selfDeafen: true,
        volume: 50
    });

    if (!player.queue.length)
      return interaction.reply({
        content: "🔸 |  There is nothing in the queue.",
        ephemeral: true,
      });

    const queue = player.queue.map(
      (t, i) => `\`${++i}.\` **${t.title}** [${t.requester}]`
    );
    const chunked = util.chunk(queue, 10).map((x) => x.join("\n"));

    const queueEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(`Current queue for ${interaction.guild.name}`)
      .setDescription(chunked[0])
      .setTimestamp();

    return interaction.reply({
      embeds: [queueEmbed],
    });
  },
};
