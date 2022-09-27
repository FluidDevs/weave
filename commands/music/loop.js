const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "loop",
    description: "Loop a song or the queue.",
    botPermissions: ["SendMessages", "EmbedLinks"],
    options: [{
        name: "options", description: "Specify whether to loop the song or queue.", type: 3, required: true,
        choices: [
            { name: "Song", value: "songChoice" },
            { name: "Queue", value: "queueChoice" },
            { name: "Off", value: "stopChoice" },
        ]
    }],
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
        })

        if (!player.playing && !player.paused) return interaction.reply({
            content: "🔸 |  There is nothing in the queue.",
            ephemeral: true
        })

        if (player.paused) return interaction.reply({
            content: "🔸 |  Resume the player to adjust the loop settings.",
            ephemeral: true
        })

        if (interaction.options.getString("options") == "songChoice") {
            if (player.trackRepeat == true) return interaction.reply({ content: "🔸 |  This song is already being looped.", ephemeral: true });
            if (player.queueRepeat == true) return interaction.reply({ content: "🔸 |  The queue is already being looped.", ephemeral: true });

            player.setTrackRepeat(true)

            return interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Looping the current song [${member}]`)
            .setTimestamp()
            ]})
        }

        if (interaction.options.getString("options") == "queueChoice") {
            if (player.trackRepeat == true) return interaction.reply({ content: "🔸 |  This song is already being looped.", ephemeral: true });
            if (player.queueRepeat == true) return interaction.reply({ content: "🔸 |  The queue is already being looped.", ephemeral: true });

            player.setQueueRepeat(true)

            return interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Looping the queue [${member}]`)
            .setTimestamp()
            ]})
        }


        if (interaction.options.getString("options") == "stopChoice") {
            
            player.setTrackRepeat(true)
            player.setQueueRepeat(false)

            return interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Removed the repeat [${member}]`)
            .setTimestamp()
            ]})
        }
    }

}
