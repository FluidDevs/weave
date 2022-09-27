const { EmbedBuilder } = require("discord.js");

module.exports = async (client) => {
  process.on("unhandledRejection", (reason, p) => {
    client.channels.cache.get("1010992700448837763").send({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription(`Crash Handler:\n\n Reason: ${reason}\n\n P: ${p}`),
      ],
    });
  });
  process.on("uncaughtException", (err, origin) => {
    client.channels.cache.get("1010992700448837763").send({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `Crash Handler:\n\nError: ${err}\n\nOrigin: ${origin}`
          ),
      ],
    });
  });
  process.on("uncaughtExceptionMonitor", (err, origin) => {
    client.channels.cache.get("1010992700448837763").send({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `Crash Handler:\n\nError: ${err}\n\nOrigin: ${origin}`
          ),
      ],
    });
  });
};
