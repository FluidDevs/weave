const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const DB = require("../../structures/schemas/djConfig");

module.exports = {
    id: "enableDjRole",
    permission: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles],

    async execute(interaction, client) {

        const { guild } = interaction

        const DB_found = await DB.findOne({guildId: guild.id});
        if(DB_found)await DB_found.updateOne({ enabled: true });
        else await DB.create({guildID: guild.id, enabled: true});

        client.djConfig.set(guild.id, {
            enabled: true,
        });

        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`DJ Role has now been enabled`).setColor("Blurple").setTimestamp()], ephemeral: true})

}
}