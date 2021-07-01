import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";
import { splitBar } from "string-progressbar";
import { checkMusicPermission } from "../../utils/functions/musicFunctions";
export default class NpCommand extends BaseCommand {
    constructor() {
        super(
            "np",
            "Get current song",
            "music",
            ["now", "nowplaying"],
            "np",
            "np"
        );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!(await checkMusicPermission(client, message))) return;
        const { player } = client.queue.get(message.guild?.id);
        const song = player.queue.current;
        const seek = player.position;
        const left = song.duration - seek;

        let embed = new MessageEmbed()
            .setTitle("Now playing")
            .setDescription(`[${song.title}](${song.url})`)
            .setColor("#554b58")
            .setThumbnail(song.thumbnail);

        if (song.duration > 0) {
            embed.addField(
                "\u200b",
                new Date(seek).toISOString().substr(11, 8) +
                    "[" +
                    splitBar(
                        song.duration == 0 ? seek : song.duration,
                        seek,
                        20
                    )[0] +
                    "]" +
                    (song.duration == 0
                        ? " ◉ LIVE"
                        : new Date(song.duration).toISOString().substr(11, 8)),
                false
            );
            embed.setFooter(
                "Time Remaining: " + new Date(left).toISOString().substr(11, 8)
            );
        }
        await message.reply({ embeds: [embed] });
    }
}
