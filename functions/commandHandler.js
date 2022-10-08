const { REST, Routes } = require("discord.js");
const { token, clientId } = require("../structures/config.json");
const { promisify } = require("util");
const glob = require("glob");
const chalk = require("chalk");
const PG = promisify(glob);

async function load (client) {

    let commandsArray = [];

    (await PG(`${process.cwd().replace(/\\/g, "/")}/commands/*/*.js`)).map(
        async (file) => {
          const command = require(file);
    
          client.commands.set(command.data.name, command);
    
          commandsArray.push(command.data);
        }
        );
      

    const rest = new REST({ version: '10' }).setToken(token);

    rest.put(Routes.applicationCommands(clientId), { body: commandsArray })
        .then(data => console.log(chalk.blueBright(`[Startup] >>> Successfully registered ${data.length} application commands.`)))
}

async function loadAdmin (client) {

  let adminCommandsArray = [];

  (await PG(`${process.cwd().replace(/\\/g, "/")}/adminCommands/*/*.js`)).map(
      async (file) => {
        const command = require(file);
  
        client.adminCommands.set(command.data.name, command);
  
        adminCommandsArray.push(command.data);
      }
      );
    

  const rest = new REST({ version: '10' }).setToken(token);

  rest.put(Routes.applicationGuildCommands(clientId, "1005770275008294992"), { body: adminCommandsArray })
      .then(data => console.log(chalk.blueBright(`[Startup] >>> Successfully registered ${data.length} admin guild commands.`)))
}

module.exports = { load, loadAdmin };