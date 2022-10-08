const permissionChecker = require("../../functions/permissionChecker.js");
const djChecker = require("../../functions/djChecker.js");
const adminChecker = require("../../functions/adminChecker.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    
    const command = client.commands.get(interaction.commandName);
    
    if (await adminChecker.check(interaction, client)) return;
    if (await permissionChecker.user(interaction, command)) return;
    if (await permissionChecker.bot(interaction)) return;
    if (await djChecker.checkCmd(interaction, client, command)) return;

    return command.execute(interaction, client);

  },
};
