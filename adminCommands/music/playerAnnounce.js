const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("player-announce")
        .setDescription("Send an annoucement to active players.")
        .addStringOption((option) => option.setName("message").setDescription("Message to send.").setRequired(true)),

    async execute(interaction, client) {

        message = interaction.options.getString("message")

        embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`Alert <:weave_warning:994313177594601482> `)
        .setDescription(message)
        .setTimestamp()

        sent = 0

        players = client.manager.players

        for (player of players.values()) {

            channel = await client.channels.cache.get(player.textChannel)

            if(!channel) continue;
            
            if (!channel.permissionsFor(channel.guild.members.me).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles,])) continue;

            await channel.send({ embeds: [embed]})

            sent +=1

        }

        interaction.reply({ content: `\`${sent} / ${client.manager.players.size}\` recieved the announcement`, embeds: [embed]})
    }
}