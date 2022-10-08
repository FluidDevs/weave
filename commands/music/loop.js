const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Loop the current song or queue.')
    .addStringOption(option => option.setName('options').setDescription('Loop type.').setRequired(true).addChoices({ name: "Song", value: "songChoice" }, { name: "Queue", value: "queueChoice" }, { name: "Off", value: "stopChoice" })),
    
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

        if (interaction.options.getString("options") == "songChoice") {
            if (player.trackRepeat) return interaction.reply({ content: "🔸 |  This song is already being looped.", ephemeral: true });
            if (player.queueRepeat) return interaction.reply({ content: "🔸 |  The queue is already being looped.", ephemeral: true });

            player.setTrackRepeat(true)

            return interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Looping the current song [${interaction.member}]`)
            .setTimestamp()
            ]})
        }

        if (interaction.options.getString("options") == "queueChoice") {
            if (player.trackRepeat) return interaction.reply({ content: "🔸 |  This song is already being looped.", ephemeral: true });
            if (player.queueRepeat) return interaction.reply({ content: "🔸 |  The queue is already being looped.", ephemeral: true });

            player.setQueueRepeat(true)

            return interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Looping the queue [${interaction.member}]`)
            .setTimestamp()
            ]})
        }


        if (interaction.options.getString("options") == "stopChoice") {
            
            player.setTrackRepeat(true)
            player.setQueueRepeat(false)

            return interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 | Removed the repeat [${interaction.member}]`)
            .setTimestamp()
            ]})
        }
    }

}
