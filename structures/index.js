const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({
    partials: [Partials.Channel],
    intents: [
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.Guilds
    ],
});

client.commands = new Collection();
client.adminCommands = new Collection();
client.buttons = new Collection();
client.nowPlaying = new Collection();
client.djConfig = new Collection();

require("../functions/buttonHandler")(client);
require("../functions/eventHandler")(client);
require("../functions/erelaHandler")(client);
require("../functions/antiCrash")(client);
require("../functions/cronJob")(client);

module.exports = client;

client.login(token);