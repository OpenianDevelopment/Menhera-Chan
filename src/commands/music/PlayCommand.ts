import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";
import { Player } from "erela.js";
import {
    GetSpotifyPlaylistTracks,
    PlaySpotifyTrack,
} from "../../utils/functions/musicFunctions";
export default class PlayCommand extends BaseCommand {
    constructor() {
        super(
            "play",
            "Play Music",
            "music",
            ["p"],
            "play <Song>",
            "play Daddy daddy doo"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        const channel = message.member?.voice?.channel;
        if (!channel) {
            const embed = new MessageEmbed()
                .setDescription(
                    "You need to join the voice channel to use this command"
                )
                .setColor("RED");
            await message.reply({ embeds: [embed] });
            return;
        }
        if (!args.length) {
            const embed = new MessageEmbed()
                .setDescription("You need to provide me with a song to play")
                .setColor("RED");
            await message.reply({ embeds: [embed] });
            return;
        }
        const serverQueue = client.queue.get(message.guild?.id);
        if (
            client.queue.get(message.guild?.id) &&
            channel !== message.guild?.me?.voice.channel
        ) {
            const embed = new MessageEmbed()
                .setDescription(
                    "You need to be in same channel as me to use this command"
                )
                .setColor("RED");
            await message.reply({ embeds: [embed] });
            return;
        }
        if (!client.user) return;
        const permissions = channel.permissionsFor(client.user);
        if (!permissions?.has("CONNECT")) {
            const embed = new MessageEmbed()
                .setDescription(
                    "I don't have permission to `Connect` in that channel."
                )
                .setColor("RED");
            await message.reply({ embeds: [embed] });
            return;
        }
        if (!permissions.has("SPEAK")) {
            const embed = new MessageEmbed()
                .setDescription(
                    "I don't have permission to `Speak` in that channel."
                )
                .setColor("RED");
            await message.reply({ embeds: [embed] });
            return;
        }
        const query = args.join(" ");
        const SpotifyTrackPattern =
            /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(track)[\/:]([A-Za-z0-9]+).*$/;
        const SpotifyPlaylistPattern =
            /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(playlist)[\/:]([A-Za-z0-9]+).*$/;

        if (!serverQueue) {
            const player: Player = client.manager.create({
                guild: message.guild?.id || "",
                textChannel: message.channel.id,
                voiceChannel: message.member?.voice.channel?.id || "",
            });
            client.queue.set(message.guild?.id, {
                player,
            });
            player.connect();
        }
        const { player } = client.queue.get(message.guild?.id);

        if (SpotifyTrackPattern.test(query)) {
            await PlaySpotifyTrack(client, query, message);
            return;
        } else if (SpotifyPlaylistPattern.test(query)) {
            await GetSpotifyPlaylistTracks(client, query, message);
            return;
        }
        const res = await client.manager.search(query, message.author);
        if (!res.tracks.length) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("I am not able to find this song");
            await message.reply({ embeds: [embed] });
        }
        player.queue.add(res.tracks[0]);
        if (!message.guild?.me?.voice.channel) {
            player.connect();
        }
        if (!player.playing && !player.paused && !player.queue.size) {
            player.play();
        } else {
            const embed = new MessageEmbed()
                .setDescription(`Enqueuing track ${res.tracks[0].title}.`)
                .setColor("#554b58");
            await message.reply({ embeds: [embed] });
        }
    }
}
