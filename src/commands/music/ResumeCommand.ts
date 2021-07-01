import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermission } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
export default class ResumeCommand extends BaseCommand {
    constructor() {
        super("resume", "Resume the music", "music", [], "resume", "resume");
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!(await checkMusicPermission(client, message))) return;
        const embed = new MessageEmbed()
            .setColor("#554b58")
            .setDescription("Player Resumed");

        const { player } = client.queue.get(message.guild?.id);
        if (!player.paused) {
            await message.reply("Music is not Paused");
            return;
        }
        player.pause(false);
        await message.reply({ embeds: [embed] });
    }
}
