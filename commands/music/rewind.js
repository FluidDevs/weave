const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "rewind",
  description: "Rewind a certain amount of seconds backwards.",
  botPermissions: ["SendMessages", "EmbedLinks"],
  options: [
    {
      name: "seconds",
      description: "Seconds to rewind.",
      type: 4,
      required: true,
    },
  ],
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

    const rewindAmount = options.getInteger("seconds");

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

    if (player.paused)
      return interaction.reply({
        content: "🔸 |  Resume the player to skip forwards.",
        ephemeral: true,
      });

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
        `🔹 |  Rewound **${rewindAmount}s** backwards [${member}]`
      )
      .setTimestamp();
    return interaction.reply({
      embeds: [rewindEmbed],
    });
  },
};
