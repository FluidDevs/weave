const { PermissionFlagsBits } = require("discord.js");

async function checkCmd (interaction, client, command) {

    const nonDj = ["dj-set", "config", "help", "commands", "stats"];

    if (!nonDj.includes(command?.name)) {
        
        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return false;
    
        if (!client.djConfig.get(interaction.guild.id)?.enabled) return false;
    
        let role = interaction.guild.roles.cache.find(
          (r) => r.id == client.djConfig.get(interaction.guild.id).djRole
        );
    
        const ans = role.comparePositionTo(interaction.member.roles.highest);
    
        if (ans > 0) {
          return interaction.reply({
            content:
              "🔸 |  DJ Mode is enabled, you do not have sufficent permissions.",
            ephemeral: true,
          });
        }
    
    }

    else return false

}

async function checkButton (interaction, client, button) {

  const nonDj = ["enableDjRole", "disableDjRole", "djConfig"];

  if (!nonDj.includes(button.id)) {
      
      if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return false;
  
      if (!client.djConfig.get(interaction.guild.id)?.enabled) return false;
  
      let role = interaction.guild.roles.cache.find(
        (r) => r.id == client.djConfig.get(interaction.guild.id).djRole
      );
  
      const ans = role.comparePositionTo(interaction.member.roles.highest);
  
      if (ans > 0) {
        return interaction.reply({
          content:
            "🔸 |  DJ Mode is enabled, you do not have sufficent permissions.",
          ephemeral: true,
        });
      }
  
  }

  else return false

}

module.exports = { checkCmd, checkButton };