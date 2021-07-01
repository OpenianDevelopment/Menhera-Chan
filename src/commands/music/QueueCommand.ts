import { Message, MessageEmbed } from "discord.js";
import { Queue } from "erela.js";
import DiscordClient from "../../client/client";
import { checkMusicPermission } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
import { PagesInteraction } from "../../utils/functions/utilityFunctions";
export default class QueueCommand extends BaseCommand {
    constructor() {
        super(
            "queue",
            "View the music Queue",
            "music",
            ["q"],
            "queue",
            "queue"
        );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!(await checkMusicPermission(client, message))) return;
        if (message.channel.type === "dm") return;
        const { player } = client.queue.get(message.guild!.id);

        const embeds = generateQueueEmbed(message, player.queue);
        if (!embeds.length) {
            const embed = new MessageEmbed()
                .setColor("#554b58")
                .setDescription("There is no other songs in the queue");
            await message.reply({
                embeds: [embed],
            });
            return;
        }
        if (embeds.length === 1)
            await message.reply({
                embeds: [embeds[0]],
            });

        if (embeds.length > 1) await PagesInteraction(embeds, message);
    }
}
function generateQueueEmbed(message: Message, queue: Queue) {
    const embeds = [];
    let k = 10;

    for (let i = 0; i < queue.length; i += 10) {
        const currentQueue = queue.slice(i, k);
        let j = i;
        k += 10;

        const info = currentQueue
            .map((track) => `${++j} - [${track.title}](${track.uri})`)
            .join("\n");

        const embed = new MessageEmbed()
            .setTitle("Song Queue\n")
            .setThumbnail(message.guild?.iconURL() || "")
            .setColor("#554b58")
            .setDescription(
                `**Current Song - [${queue.current?.title}](${queue.current?.uri})**\n\n${info}`
            )
            .setTimestamp();
        embeds.push(embed);
    }

    return embeds;
}
