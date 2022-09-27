const { token } = require("./config.json");
const { nodes, SpotifyClientID, SpotifySecret } = require("./config.json");
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { Manager } = require("erela.js");
const Spotify = require("better-erela.js-spotify").default;
const Apple = require("better-erela.js-apple").default;

// Create Client

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

require("./handlers/commandsHandler")(client);
require("./handlers/eventsHandler")(client);
require("./handlers/buttonHandler")(client);
require("./handlers/antiCrash")(client);
require("./handlers/cronJob")(client);


client.manager = new Manager({
  nodes,
  plugins: [
    new Spotify({
      clientID: SpotifyClientID,
      clientSecret: SpotifySecret,
    }),
    new Apple(),
  ],
  send: (id, payload) => {
    let guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

module.exports = client;

client.login(token);
