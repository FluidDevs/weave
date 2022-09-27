const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const DB = require("../../structures/schemas/djConfig");

module.exports = {
    name: "dj-set",
    description: "Set the DJ Role.",
    userPermissions: ["Administrator"],
    botPermissions: ["SendMessages", "EmbedLinks"],
    options: [
        {
            name: "role",
            description: "DJ Role.",
            type: 8,
            required: true,
        },
    ],

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction, client) {


        const { guild} = interaction;

        role = interaction.options.getRole("role")

        roleId = role.id

        const DB_found = await DB.findOne({guildId: guild.id});
        if(DB_found)await DB_found.updateOne({ enabled: true, djRoleId: roleId });
        else await DB.create({guildId: guild.id, enabled: true, djRoleId: roleId });

        client.djConfig.set(guild.id, {
            enabled: true,
            djRole: roleId
        });

        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`DJ Role set to ${role} and above.`).setColor("Blurple").setTimestamp()], ephemeral: true})
    
    }
}