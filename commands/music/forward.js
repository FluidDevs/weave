const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "forward",
    description: "Skip a certain amount of seconds forward.",
    botPermissions: ["SendMessages", "EmbedLinks"],
    options: [
        {
            name: "seconds",
            description: "Seconds forward.",
            type: 4,
            required: true,
        }
    ],
    async execute(interaction, client) {

        const { options, member, guild } = interaction;
        
        const VoiceChannel = member.voice.channel;

        if (!VoiceChannel) return interaction.reply({ content: "🔸 |  You aren't in a voice channel. Join one to be able to play music! Already in a voice channel? Make sure I have permission to see it.", ephemeral: true });

        if (guild.members.me.voice.channelId && VoiceChannel.id !== guild.members.me.voice.channelId) return interaction.reply({ content: `🔸 |  I'm already playing music in <#${guild.me.voice.channelId}>.`, ephemeral: true });

        const forwardAmount = options.getInteger("seconds");

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
            content: "🔸 |  Resume the player to skip forwards.",
            ephemeral: true
        })

        let seektime = Number(player.position) + Number(forwardAmount) * 1000;

        if (Number(forwardAmount) <= 0) seektime = Number(player.position);

        if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;

        player.seek(Number(seektime));

        const forwardEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 |  Skipped **${forwardAmount}s** forwards [${member}]`)
            .setTimestamp() 
        return interaction.reply({ embeds: [forwardEmbed] })

    }

}