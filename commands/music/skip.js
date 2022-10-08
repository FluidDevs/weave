const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip the current song."),

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

        await player.stop();

        const skipEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 |  Skipped [${interaction.member}]`)
            .setTimestamp()

        return interaction.reply({ embeds: [skipEmbed] });

    }

}