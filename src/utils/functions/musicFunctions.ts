import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { getData } from "spotify-url-info";

export async function PlaySpotifyTrack(
    client: DiscordClient,
    SpotifyUrl: string,
    message: Message,
    type?: string
) {
    const spTrack = await getData(SpotifyUrl);
    const song = `${spTrack.name} ${spTrack.artists[0].name}`;

    const Tracks: any = await client.manager.search(song, message.author);
    if (!Tracks) {
        const embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`Can't add this song ${spTrack.title}`);
        return message.reply({ embeds: [embed] });
    }

    Tracks.tracks[0].title = spTrack.name;
    Tracks.tracks[0].author = spTrack.artists[0].name;
    Tracks.tracks[0].uri = SpotifyUrl;
    Tracks.tracks[0].thumbnail = spTrack.album.images[0].url;
    const { player } = client.queue.get(message.guild?.id);
    player.queue.add(Tracks.tracks[0]);
    if (!player.playing && !player.paused && !player.queue.size) {
        player.play();
    } else {
        if (!type) {
            const embed = new MessageEmbed()
                .setDescription(`Enqueuing track ${Tracks.tracks[0].title}.`)
                .setThumbnail(Tracks.tracks[0].thumbnail)
                .setColor("#554b58");
            await message.reply({ embeds: [embed] });
        }
    }
}

export async function GetSpotifyPlaylistTracks(
    client: DiscordClient,
    SpotifyUrl: string,
    message: Message
) {
    const spPlaylist = await getData(SpotifyUrl);
    const embed = new MessageEmbed()
        .setColor("#554b58")
        .setThumbnail(spPlaylist.images[0].url)
        .setTitle(`${spPlaylist.name} Added`)
        .addField("Total Songs", `\`${spPlaylist.tracks.items.length}\``, true)
        .addField("By", `\`${spPlaylist.owner.display_name}\``, true);
    await message.reply({ embeds: [embed] });
    spPlaylist.tracks.items.forEach((track: any) => {
        PlaySpotifyTrack(
            client,
            `https://open.spotify.com/track/${track.track.id}/`,
            message,
            "playlist"
        );
    });
}
export async function checkMusicPermission(
    client: DiscordClient,
    message: Message
) {
    if (!client.queue.get(message.guild?.id)) {
        await message.reply("No Music is being played");
        return false;
    }

    if (message.member?.voice.channel !== message.guild?.me?.voice.channel) {
        const embed = new MessageEmbed()
            .setDescription(
                "You need to be in same channel as me to use this command"
            )
            .setColor("RED");
        await message.reply({ embeds: [embed] });
        return false;
    }
    return true;
}
