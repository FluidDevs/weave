const { promisify } = require("util");
const glob = require("glob");
const chalk = require("chalk");
const PG = promisify(glob)

module.exports = async (client) => {

    const buttonsFolder = await PG(`${process.cwd().replace(/\\/g, "/")}/buttons/*/*.js`)

    buttonsFolder.map(async (file) => {
        
        const buttonFile = require(file)

        if (!buttonFile.id) return;

        client.buttons.set(buttonFile.id, buttonFile)
        
     });

     console.log(chalk.blueBright("[Startup] >>> Buttons loaded successfully."));

}