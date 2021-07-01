import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermission } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
export default class TreblebassCommand extends BaseCommand {
    constructor() {
        super(
            "treble-bass",
            "Add treble-bass filter",
            "music",
            ["tb"],
            "treble-bass",
            "treble-bass"
        );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!(await checkMusicPermission(client, message))) return;
        const { player } = client.queue.get(message.guild?.id);
        const embed = new MessageEmbed().setColor("#554b58");

        if (player.isTreblebass) {
            player.reset();
            embed.setDescription("Treble-bass Deactivated");
            await message.reply({ embeds: [embed] });
            return;
        }
        player.reset();
        player.setTreblebass();
        embed.setDescription("Treble-bass Activated");
        await message.reply({ embeds: [embed] });
    }
}
