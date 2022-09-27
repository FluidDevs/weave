const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "resume",
    description: "Resume the current paused song.",
    botPermissions: ["SendMessages", "EmbedLinks"],

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
            volume: 50
        });


        if (!player.playing && !player.paused) return interaction.reply({
            content: "🔸 |  There is nothing in the queue.",
            ephemeral: true
        })

        if (player.playing) return interaction.reply({
            content: "🔸 |  The player is already playing music.",
            ephemeral: true
        })

        await player.pause(false);

        const resumeEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Resumed [${member}]`)
            .setTimestamp()
        return interaction.reply({ embeds: [resumeEmbed] })

    }

}