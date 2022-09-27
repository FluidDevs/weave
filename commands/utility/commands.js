const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "commands",
    description: "View all the commands.",
    botPermissions: ["SendMessages", "EmbedLinks"],

    async execute(interaction, client) {

        mainEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`Weaves Commands`)
        .setDescription("**Music Related Commands:**\n> /play - Supports Spotify and Apple Music\n> /volume - Adjust the volume\n> /pause - Pause the player\n> /resume - Resume the player\n> /skip - Skip the current playing song\n> /np - View the current playing song\n> /shuffle - Shuffle the queue\n> /loop - Configure different loop modes\n> /forward - Skip forward in a song in seconds\n> /rewind -  Rewind a song in seconds\n> /restart - Restart the current song\n> /remove - Remove a song from the queue\n> /queue - View the current queue\n> /lyrics - Get the lyrics of the current playing song\n> /stop - Stop the player completely\n> /play-previous - Play the previous song again and skip the current song.\n\n**Utility Commands:**\n> /help - General help command\n> /commands - Where you are currently\n> /stats - View important statistics of Weave\n> /config - Configure certain settings -> e.g DJ")
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