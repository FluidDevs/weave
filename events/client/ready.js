const commandLoader = require('../../functions/commandHandler.js');
const songsLoader = require('../../functions/songsLoader.js');
const djCacher = require('../../functions/djCacher.js');
const chalk = require('chalk');

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {

    client.manager.init(client.user.id);

    console.log(chalk.magenta(`Ready! Logged in as ${client.user.tag}`));
    
    commandLoader.load(client);
    commandLoader.loadAdmin(client);
    djCacher.load(client);
    songsLoader.load(client);
  },
};
