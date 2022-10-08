const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const DB = require("../../structures/schemas/djConfig");

module.exports = {
    id: "disableDjRole",
    userPermissions: [PermissionFlagsBits.Administrator],

    async execute(interaction, client) {

        const { guild } = interaction
        const DB_found = await DB.findOne({guildId: guild.id});
        if(DB_found)await DB_found.updateOne({ enabled: false });
        else await DB.create({guildID: guild.id, enabled: false });

        client.djConfig.set(guild.id, {
            enabled: false,
        });

        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`DJ Role has now been disabled`).setColor("Blurple").setTimestamp()], ephemeral: true})

}

}