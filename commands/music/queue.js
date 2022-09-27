const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const util = require("../../util/erelaUtil.js");

module.exports = {
  name: "queue",
  description: "View the queue.",
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
      .setTitle(`Current queue for ${guild.name}`)
      .setDescription(chunked[0])
      .setTimestamp();

    return interaction.reply({
      embeds: [queueEmbed],
    });
  },
};
