const { EmbedBuilder } = require("discord.js");
const { time } = require('@discordjs/builders')
const { inspect } = require('util')

module.exports = async (client) => {

  process.on("unhandledRejection", async (err) => {

    console.log(err)
      const date = new Date()
      const relative = time(date, 'F')

      const channel = client.channels.cache.get("1010992700448837763")

        const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(`**From:** \`unhandledRejection\`\n**Time:** ${relative}\n\n**Error:**\`\`\`${inspect(err, {depth: 0})}\`\`\``)
        .setColor("Red")
    
        await channel.send({ embeds: [embed] }).catch(console.log)
  });

  process.on("uncaughtException", async (err) => {
    console.log(err)

    const date = new Date()
    const relative = time(date, 'F')

    const channel = client.channels.cache.get("1010992700448837763")

      const embed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription(`**From:** \`uncaughtException\`\n**Time:** ${relative}\n\n**Error:**\`\`\`${inspect(err, {depth: 0})}\`\`\``)
      .setColor("Red")
  
      await channel.send({ embeds: [embed] }).catch(console.log)

  });
};
