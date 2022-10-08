const { database } = require("../structures/config.json");
const DB = require("../structures/schemas/djConfig");
const mongoose = require("mongoose");
const chalk = require("chalk");

async function load (client) {

    if (!database) return;
    mongoose
      .connect(database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(chalk.greenBright("[Startup] >>> Now connected to Mongo DB."));
      })
      .catch((err) => {
        console.error(err);
      });

    const data = await DB.find({}); //get all documents
    for (const document of data) {
      client.djConfig.set(document.guildId, {
        enabled: document.enabled,
        djRole: document.djRoleId,
      });
    }

    return console.log(chalk.blueBright("[Startup] >>> DJ Config loaded successfully."));
}

module.exports = { load };