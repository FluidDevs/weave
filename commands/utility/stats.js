const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");
const DB_COUNTER = require("../../structures/schemas/songsPlayed");

module.exports = {
    name: "stats",
    description: "View Weave stats.",
    botPermissions: ["SendMessages", "EmbedLinks"],

    async execute(interaction, client) {

        const getChannelTypeSize = (type) => client.channels.cache.filter((channel) => type.includes(channel.type)).size;
        
        const DBFoundCounter = await DB_COUNTER.findOne({
            ident: "counter"
        });

        mainEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`Weave Stats`)
        .addFields([
            { name: "Ping Pong 🏓", value: `\`${client.ws.ping}ms\``, inline: true },
            { name: "Servers Jamming <a:weave_cd:992836194029289552>", value: `\`${client.manager.players.size} / ${client.guilds.cache.size}\``, inline: true },
            { name: "Songs Played In Total <a:weave_dance:992839334459887776>", value: `\`${DBFoundCounter.songsPlayed}\``, inline: true },
            { name: "Users <:weave_you:992838889142222931>", value: `\`${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\``, inline: true },
            { name: "Text Channels 🛠️", value: `\`${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildNews])}\``, inline: true },
            { name: "Voice Channels <:weave_voice:992838418641985576>", value: `\`${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}\``, inline: true },
        ])
        .setTimestamp()
        
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Discord Support Server")
            .setURL('https://discord.gg/r9zyJQdGGt'),
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Add Weave")
            .setURL('https://discord.com/api/oauth2/authorize?client_id=985972679263805492&permissions=414501432577&scope=bot%20applications.commands'),
        )

        interaction.reply({ embeds: [mainEmbed], components: [row]})
    }
}