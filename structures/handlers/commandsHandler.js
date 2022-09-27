const { promisify } = require("util");
const glob = require("glob");
const PG = promisify(glob);
const { REST } = require("@discordjs/rest");
const { token } = require("../config.json");
const { clientId } = require("../config.json");
const { Routes } = require("discord.js")
module.exports = async (client) => {

  commandsArray = [];

  (await PG(`${process.cwd().replace(/\\/g, "/")}/commands/*/*.js`)).map(
    async (file) => {
      const command = require(file);

      client.commands.set(command.name, command);

      commandsArray.push(command);

    }
  );

  adminCommandsArray = [];

  (await PG(`${process.cwd().replace(/\\/g, "/")}/adminCommands/*/*.js`)).map(
    async (file) => {
      const command = require(file);

      client.adminCommands.set(command.name, command);

      adminCommandsArray.push(command);

    }
  );

  client.on("ready", async () => {

    const rest = new REST({ version: '10' }).setToken(token);
    
    await rest.put(Routes.applicationCommands(clientId), {body: commandsArray});

    await rest.put(Routes.applicationGuildCommands(clientId, ""), {body: adminCommandsArray});

    log.startup("Admin & Standard Commands Loaded");

  });
};
