const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "volume",
    description: "Adjust the volume.",
    botPermissions: ["SendMessages", "EmbedLinks"],
    options: [
        {
            name: "percent",
            description: "Provide a volume between 1-100.",
            type: 4,
            required: true,
        }
    ],
    async execute(interaction, client) {

        const { options, member, guild } = interaction;
        
        const VoiceChannel = member.voice.channel;

        if (!VoiceChannel) return interaction.reply({ content: "🔸 |  You aren't in a voice channel. Join one to be able to play music! Already in a voice channel? Make sure I have permission to see it.", ephemeral: true });

        if (guild.members.me.voice.channelId && VoiceChannel.id !== guild.members.me.voice.channelId) return interaction.reply({ content: `🔸 |  I'm already playing music in <#${guild.me.voice.channelId}>.`, ephemeral: true });

        const volume = options.getInteger("percent");

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

        if (player.paused) return interaction.reply({
            content: "🔸 |  Resume the player to adjust the volume.",
            ephemeral: true
        })
        
        if (volume < 0 || volume > 100) return interaction.reply({ content: `🔸 |  You can only set the volume from 0 to 100.`, ephemeral: true });

        player.setVolume(volume);

        const volumeEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 |  Volume has been adjusted to **${player.volume}%** [${member}]`)
            .setTimestamp()
        return interaction.reply({ embeds: [volumeEmbed] })

    }

}