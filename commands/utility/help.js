const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Recieve Help.'),

    async execute(interaction, client) {

        mainEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`Weave Help`)
        .setDescription("Hey! I'm Weave, an advanced Discord Music Bot. I'm designed for the community, and I'm completely free! Run `/commands` for a list of my commands or `/config` to adjust my settings!")
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