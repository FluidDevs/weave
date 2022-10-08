const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reboot")
    .setDescription("Save current players and reboot ready Weave."),
    
  async execute(interaction, client) {

    embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle(`Restart Upcoming! <:weave_warning:994313177594601482> `)
      .setDescription(
        "Weave is going to restart within 5 minutes. The music will resume shortly."
      )
      .setTimestamp();

    sent = 0;

    for (player of client.manager.players.values()) {
      if (client.channels.cache.get(player.textChannel)) {
        
        channel = client.channels.cache.get(player.textChannel);

        if (!channel) continue;

        if (
          !channel
            .permissionsFor(channel.guild.members.me)
            .has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles])
        )
          continue;

        await channel.send({
          embeds: [embed],
        });

        sent += 1;
      }
    }

    const queueObj = {};
    for (keyValue of client.manager.players) {
      try {
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
      } catch (error) {
        console.error(error);
      }
    }
    queueJSON = JSON.stringify(queueObj);

    fs.writeFile("json/tempQueue.json", queueJSON, () => {});

    interaction.reply({
      content: `\`${sent} / ${client.manager.players.size}\` recieved the reboot message. Now ready to reboot!`,
      embeds: [embed],
    });

  },
};
