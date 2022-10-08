const guildCreateDelete = require('../../functions/guildCreateDelete.js');

module.exports = {
  name: "guildDelete",
  async execute(guild, client) {

    await guildCreateDelete.create(guild, client, false);

  },
};