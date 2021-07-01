import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermission } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
export default class SkipCommand extends BaseCommand {
    constructor() {
        super(
            "skip",
            "Skip the current playing song",
            "music",
            ["s"],
            "skip",
            "skip"
        );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!(await checkMusicPermission(client, message))) return;
        const { player } = client.queue.get(message.guild?.id);
        const embed = new MessageEmbed()
            .setColor("#554b58")
            .setDescription("Song Skipped");
        player.stop();
        await message.reply({ embeds: [embed] });
    }
}
