const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const DB = require("../../structures/schemas/djConfig");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dj-set')
		.setDescription('Set the dj role.')
        .addRoleOption(option => option.setName('role').setDescription('DJ Role.').setRequired(true)),
    userPermissions: ["Administrator"],

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