const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Adjust the volume.")
        .addIntegerOption(option => option.setName('percent').setDescription('Provide a volume between 1-100.').setRequired(true)),

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
        
        const volume = interaction.options.getInteger("percent");

        if (volume < 0 || volume > 100) return interaction.reply({ content: `🔸 |  You can only set the volume from 0 to 100.`, ephemeral: true });

        player.setVolume(volume);

        const volumeEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 |  Volume has been adjusted to **${player.volume}%** [${interaction.member}]`)
            .setTimestamp()
        return interaction.reply({ embeds: [volumeEmbed] })

    }

}