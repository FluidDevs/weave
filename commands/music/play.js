const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const musicChecker = require("../../functions/musicChecker.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song.")
        .addStringOption(option => option.setName("query").setDescription("Provide the name of the song or URL.").setRequired(true)),

    async execute(interaction, client) {

    function msToTime(duration) {
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
            
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            
            return minutes + ":" + seconds;
        }
                  
        if (await musicChecker.vc(interaction)) return;

        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channelId,
            selfDeafen: true,
            volume: 50
        });
        

        const query = interaction.options.getString("query");

        let res = await player.search(query, interaction.user);

        if (res.loadType === "LOAD_FAILED") {
            if (!player.queue.current) player.destroy();
            return interaction.reply({ content: "🔸 |  An error has occured while trying to add this song.", ephemeral: true })
        }

        if (res.loadType === "NO_MATCHES") {
            if (!player.queue.current) player.destroy();
            return interaction.reply({ content: "🔸 |  No results found.", ephemeral: true })
        }

        if (res.loadType === "PLAYLIST_LOADED") {
            if (player.state !== 'CONNECTED') player.connect()
            player.queue.add(res.tracks);
            player.pause(false)
            if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
            const playlistEmbed = new EmbedBuilder()
                .setDescription(`🔹 |  **[${res.playlist.name}](${query})** has been added to the queue. [${interaction.member}]`)
                .addFields({ name: "Enqueued", value: `\`${res.tracks.length}\` tracks`})
                .setTimestamp()
                .setColor("Blurple")

            if(res.tracks.length > 400) return interaction.channel.send({ embeds: [playlistEmbed] })

            return interaction.reply({ embeds: [playlistEmbed] })

        }

        if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
            if (player.state !== 'CONNECTED') player.connect()
            player.queue.add(res.tracks[0]);
            player.pause(false)
        }

        const enqueueEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`🔹 |  Enqueued **[${res.tracks[0].title}](${res.tracks[0].uri})** [${msToTime(res.tracks[0].duration) || "Undetermined"} - ${interaction.member}]`)
            .setTimestamp()
        await interaction.reply({ embeds: [enqueueEmbed] });

        if (!player.playing && !player.paused && !player.queue.size) player.play()

        if (player.queue.totalSize > 1)
            enqueueEmbed.addFields({ name:"Position in queue", value: `${player.queue.size - 0}` });
            if (player.trackRepeat) enqueueEmbed.addFields({name:"Looping", value:"Song"});
            if (player.queueRepeat) enqueueEmbed.addFields({name:"Looping", value:"Queue"});
        return interaction.editReply({ embeds: [enqueueEmbed] })


    }

}
