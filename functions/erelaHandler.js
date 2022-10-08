const { nodes } = require("../structures/config.json");
const { Manager } = require("erela.js");

module.exports = async (client) => {
  client.manager = new Manager({
    nodes,
    send: (id, payload) => {
      let guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
  });
};
