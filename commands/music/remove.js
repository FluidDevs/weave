const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remove a song from the queue.")
        .addIntegerOption(option => option.setName('track').setDescription('Track / song position.').setRequired(true)),

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
        
        const position = interaction.options.getInteger("track");

        player.queue.remove(position-1)

        const removeEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 |  Removed song with positon of **${position}** [${interaction.member}]`)
            .setTimestamp()
        return interaction.reply({ embeds: [removeEmbed] })

    }

}