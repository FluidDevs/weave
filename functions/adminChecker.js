async function check (interaction, client) {

    const adminCommands = ["eval", "player-announce", "reboot"];

    if (adminCommands.includes(interaction?.commandName)) {
      const adminCommand = client.adminCommands.get(interaction.commandName);
      if (interaction.user.id !== "564917068386926631") return interaction.reply({ content: "🔸 |  You do not have permission to use this command.", ephemeral: true });
      adminCommand.execute(interaction, client);
      return true;
    }
    
    else return false

}

module.exports = { check };