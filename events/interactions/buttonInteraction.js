const permissionChecker = require("../../functions/permissionChecker.js");
const djChecker = require("../../functions/djChecker.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    const button = client.buttons.get(interaction.customId);

    if (await permissionChecker.user(interaction, button)) return;
    if (await permissionChecker.bot(interaction)) return;
    if (await djChecker.checkButton(interaction, client, button)) return;

    return button.execute(interaction, client);
  },
};
