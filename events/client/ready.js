const { EmbedBuilder } = require("discord.js");
const { mongoose } = require("mongoose");
const fs = require("fs");
const { database } = require("../../structures/config.json");
const DB = require("../../structures/schemas/djConfig");

log = require("custom-logger").config({ level: 0 });
log.new({
  startup: { level: 5, event: "startup", color: "rainbow" },
});

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {

    log.startup(`Weave is now ready, logged in as ${client.user.tag}`)

    client.manager.init(client.user.id);

    if (!database) return;
    mongoose
      .connect(database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        log.startup("Now connected to Mongo DB");
      })
      .catch((err) => {
        log.error(err);
      });

    const data = await DB.find({}); //get all documents
    for (const document of data) {
      client.djConfig.set(document.guildId, {
        enabled: document.enabled,
        djRole: document.djRoleId,
      });
    }

    log.startup("Updated Collection for DJ Config");

    const wait = require("node:timers/promises").setTimeout;

    try {
      let rawData1 = fs.readFileSync("json/tempQueue.json");

      const rawData = JSON.parse(rawData1);

      for (serv in rawData) {
        tempPlayer = rawData[serv];

        const player = client.manager.create(tempPlayer.options);

        for (song of tempPlayer.queue) {
          const req1 = await client.users.fetch(song.requester);

          res = await player.search(song.uri, req1);

          player.queue.add(res.tracks[0]);
        }
        player.connect();
        player.play();

        if (tempPlayer.trackRepeat == true) player.setTrackRepeat(true);
        if (tempPlayer.queueRepeat == true) player.setQueueRepeat(true);

        await wait(10)
      }

      log.startup("Reloaded all players / songs");
      
    } catch (error) {
      console.log(error);
    }

    client.channels.cache.get('').send({
        embeds: [new EmbedBuilder().setColor("Green").setDescription(`🔹 |  Weave has restarted successfully and started previous players.`).setTimestamp()]
    })

    setInterval(async function () {
        client.user.setActivity("to your songs!", { type: 2 });
    }, 10000);
  },
};
