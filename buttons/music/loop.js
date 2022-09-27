const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  id: "loopMusic",
  botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],

  async execute(interaction, client) {
    const { options, member, guild } = interaction;

    const VoiceChannel = member.voice.channel;

    if (!VoiceChannel) return interaction.reply({ content: "🔸 |  You aren't in a voice channel. Join one to be able to play music! Already in a voice channel? Make sure I have permission to see it.", ephemeral: true });

    if (guild.members.me.voice.channelId && VoiceChannel.id !== guild.members.me.voice.channelId) return interaction.reply({ content: `🔸 |  I'm already playing music in <#${guild.me.voice.channelId}>.`, ephemeral: true });


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

    const loopEmbed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (!player.trackRepeat && !player.queueRepeat) {
      loopEmbed.setDescription(`🔹 | Looping Song [${member}]`);
      player.setTrackRepeat(true);

      await interaction.reply({
        embeds: [loopEmbed],
      });

      await wait(2000);
      return interaction.deleteReply();
    }
    if (player.trackRepeat && !player.queueRepeat) {
      loopEmbed.setDescription(`🔹 | Looping Queue [${member}]`);
      player.setTrackRepeat(false);
      player.setQueueRepeat(true);

      await interaction.reply({
        embeds: [loopEmbed],
      });

      await wait(2000);
      return interaction.deleteReply();
    }
    if (!player.trackRepeat && player.queueRepeat) {
      loopEmbed.setDescription(`🔹 | Removed the repeat [${member}]`);
      player.setTrackRepeat(false);
      player.setQueueRepeat(false);

      await interaction.reply({
        embeds: [loopEmbed],
      });

      await wait(2000);
      return interaction.deleteReply();
    }
  },
};
