const guildCreateDelete = require('../../functions/guildCreateDelete.js');

module.exports = {
  name: "guildCreate",
  async execute(guild, client) {

    await guildCreateDelete.create(guild, client, true);

  },
};
