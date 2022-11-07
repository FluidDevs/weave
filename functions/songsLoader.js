const wait = require("node:timers/promises").setTimeout;
const { EmbedBuilder } = require("discord.js");
const chalk = require("chalk");
const fs = require("fs");

async function load(client) {
  await wait(10000);

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

      if (tempPlayer.trackRepeat) player.setTrackRepeat(true);
      if (tempPlayer.queueRepeat) player.setQueueRepeat(true);

      await wait(2000);
    }
    console.log(chalk.blueBright("[Startup] >>> Reloaded all players / songs."));

    client.channels.cache.get(client.config.logChannelId).send({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `🔹 |  Weave has restarted successfully and started previous players.`
          )
          .setTimestamp(),
      ],
    });
  
}
module.exports = { load };
