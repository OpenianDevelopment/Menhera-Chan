import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermission } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
export default class SoftCommand extends BaseCommand {
    constructor() {
        super(
            "soft",
            "Add soft filter to the song",
            "music",
            [],
            "soft",
            "soft"
        );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!(await checkMusicPermission(client, message))) return;
        const { player } = client.queue.get(message.guild?.id);
        const embed = new MessageEmbed().setColor("#554b58");

        if (player.isSoft) {
            player.reset();
            embed.setDescription("Soft Filter Deactivated");
            await message.reply({ embeds: [embed] });
            return;
        }
        player.reset();
        player.setSoft();
        embed.setDescription("Soft Filter Activated");
        await message.reply({ embeds: [embed] });
    }
}
