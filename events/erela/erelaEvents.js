const DB_COUNTER = require("../../structures/schemas/songsPlayed");
const client = require("../../structures/index.js");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionFlagsBits,
  ButtonStyle
} = require("discord.js");

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return minutes + ":" + seconds;
}

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("volumeDownMusic") //DONE
    .setStyle(ButtonStyle.Danger)
    .setEmoji("🔉"),
  new ButtonBuilder()
    .setCustomId("volumeUpMusic") //DONE
    .setStyle(ButtonStyle.Success)
    .setEmoji("🔊"),
  new ButtonBuilder()
    .setCustomId("skipMusic") //DONE
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⏩"),
  new ButtonBuilder()
    .setCustomId("pauseResumeMusic") //DONE
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⏯️"),
  new ButtonBuilder()
    .setCustomId("loopMusic") //DONE
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("🔁")
);

client.manager
  .on("nodeConnect", (node) => {
    log.startup(
      `[Erela] >> Connection has been established to "${node.options.identifier}".`
    );
  })

  .on("nodeDisconnect", (node, error) => {
    log.startup(
      `[Erela] >> Lost connection to "${node.options.identifier}" due to an error: ${error.message}.`
    );
  })

  .on("nodeError", (node, error) => {
    log.startup(
      `[Erela] >> Node "${node.options.identifier}" has encountered an error: ${error.message}.`
    );
  })

  .on("trackEnd", async (player, track) => {
  
    if(!client.channels.cache.get(player.textChannel)) return;

    if (client.channels.cache.get(player.textChannel)) {

      const playerChannel = client.channels.cache.get(player.textChannel);

      messageID = client.nowPlaying.get(player.guild); //Fetch message id from collection with key as player.guild (aka guildID)

      if(!playerChannel.messages.fetch(messageID)) return;

      const fetchedMessage = await playerChannel.messages.fetch(messageID); //Fetch the message

      if (fetchedMessage.deletable) await fetchedMessage.delete(); //Check if deleteable then delete message

      // DB fetch and update counter

      const dbFoundCounter = await DB_COUNTER.findOne({
        ident: "counter",
      });
      if (dbFoundCounter)
        await dbFoundCounter.updateOne({
          songsPlayed: dbFoundCounter.songsPlayed + 1,
        });
    }
  })

  .on("trackStart", async (player, track) => {
    if(!client.channels.cache.get(player.textChannel)) return;

    if (client.channels.cache.get(player.textChannel)) {
      const playerChannel = client.channels.cache.get(player.textChannel);

      if (
        !playerChannel
          .permissionsFor(playerChannel.guild.members.me)
          .has([
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.AttachFiles,
          ])
      ) return;

      trackStartEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setImage(track.displayThumbnail("maxresdefault"))
        .setTimestamp();

      trackStartEmbed.setDescription(
        `🔹 |  Now Playing **[${track.title}](${track.uri})** [${
          msToTime(track.duration) || "Undetermined"
        } - <@${track.requester.id}>]`
      );
      if (player.trackRepeat == true)
        trackStartEmbed.setDescription(
          `🔹 |  Now Playing **[${track.title}](${track.uri})** [${
            msToTime(track.duration) || "Undetermined"
          } - Song Repeating - <@${track.requester.id}>]`
        );

      if (player.queueRepeat == true)
        trackStartEmbed.setDescription(
          `🔹 |  Now Playing **[${track.title}](${track.uri})** [${
            msToTime(track.duration) || "Undetermined"
          } - Queue Repeating - <@${track.requester.id}>]`
        );

      const message = await playerChannel.send({
        embeds: [trackStartEmbed],
        components: [row],
      });

      client.nowPlaying.set(player.guild, message.id); //Set nowplaying collection
    }
  })

  .on("queueEnd", async (player, track) => {

    if(!client.channels.cache.get(player.textChannel)) return;

    if (client.channels.cache.get(player.textChannel)) {
      const playerChannel = client.channels.cache.get(player.textChannel);

      messageID = client.nowPlaying.get(player.guild); //Fetch message id from collection with key as player.guild (aka guildID)

      if(!playerChannel.messages.fetch(messageID)) return;

      const fetchedMessage = await playerChannel.messages.fetch(messageID); //Fetch the message

      if (fetchedMessage.deletable) await fetchedMessage.delete(); //Check if deleteable then delete message

      client.nowPlaying.delete(player.guild);

      if (
        !playerChannel
          .permissionsFor(playerChannel.guild.members.me)
          .has([
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.AttachFiles,
          ])
      ) return;

      const leaveEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`🔹 |  Queue Ended - [Thanks for using Weave Music!]`)
        .setTimestamp();

      await playerChannel.send({
        embeds: [leaveEmbed],
      });

      player.destroy();
      player.disconnect();
    }
  });
