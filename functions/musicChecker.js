async function vc (interaction) {

    const VoiceChannel = interaction.member.voice.channel;

    if (!VoiceChannel) return interaction.reply({ content: "🔸 |  You aren't in a voice channel. Join one to be able to play music! Already in a voice channel? Make sure I have permission to see it.", ephemeral: true });

    if (interaction.guild.members.me.voice.channelId && VoiceChannel.id !== interaction.guild.members.me.voice.channelId) return interaction.reply({ content: `🔸 |  I'm already playing music in <#${interaction.guild.members.me.voice.channelId}>.`, ephemeral: true });
    
    if(!VoiceChannel.joinable) return interaction.reply({ content: "🔸 |  I do not have permission to join your voice channel.", ephemeral: true})

    return false;
}

async function playing (interaction, player, single) {
    if (!player.playing && !player.paused) return interaction.reply({
        content: "🔸 |  There is nothing in the queue.",
        ephemeral: true
    })

    if(single) return false;
    if (player.paused) return interaction.reply({
        content: "🔸 |  Resume the player to use the music.",
        ephemeral: true
    })

    return false;
}

module.exports = { vc, playing };