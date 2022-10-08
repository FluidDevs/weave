const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('forward')
    .setDescription('Skip a certain amount of seconds forward.')
    .addIntegerOption(option => option.setName('seconds').setDescription('Seconds forward.').setRequired(true)),

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

        const forwardAmount = interaction.options.getInteger("seconds");

        let seektime = Number(player.position) + Number(forwardAmount) * 1000;

        if (Number(forwardAmount) <= 0) seektime = Number(player.position);

        if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;

        player.seek(Number(seektime));

        const forwardEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 |  Skipped **${forwardAmount}s** forwards [${interaction.member}]`)
            .setTimestamp() 
        return interaction.reply({ embeds: [forwardEmbed] })

    }

}