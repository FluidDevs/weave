const { promisify } = require("util");
const glob = require("glob");
const chalk = require("chalk");
const PG = promisify(glob);

module.exports = async (client) => {
  (await PG(`${process.cwd().replace(/\\/g, "/")}/events/*/*.js`)).map(
    async (file) => {
      const event = require(file);

      if (!event.name) {
        return;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  );

  console.log(chalk.blueBright(`[Startup] >>> Events loaded successfully.`));  
};
  
