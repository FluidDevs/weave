const { EmbedBuilder } = require("discord.js");
CronJob = require("cron").CronJob;
const fs = require("fs");

module.exports = async (client) => {
  var saveQueueJob = new CronJob("*/10 * * * *", async () => {
    const queueObj = {};
    for (keyValue of client.manager.players) {
        if (!keyValue[1].queue.current.uri) continue;
        queueObj[keyValue[0]] = {
          options: keyValue[1].options,
          queue: [
            {
              uri: keyValue[1].queue.current.uri,
              requester: keyValue[1].queue.current.requester.id,
            },
            ...keyValue[1].queue.map((song) => {
              return {
                uri: song.uri,
                requester: song.requester.id,
              };
            }),
          ],
          trackRepeat: keyValue[1].trackRepeat,
          queueRepeat: keyValue[1].queueRepeat,
        };
    }

    queueJSON = JSON.stringify(queueObj);

    fs.writeFile("json/tempQueue.json", queueJSON, () => {});

    client.channels.cache.get("1025532328258310175").send({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(`Successfully backed up songs.`)
          .setTimestamp(),
      ],
    });
  });


  saveQueueJob.start();
};
