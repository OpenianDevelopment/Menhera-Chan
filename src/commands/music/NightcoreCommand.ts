import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermission } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
module.exports = class NightcoreCommand extends BaseCommand {
    constructor() {
        super(
            "nightcore",
            "Add nightcore effect",
            "music",
            [],
            "nightcore",
            "nightcore"
        );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!(await checkMusicPermission(client, message))) return;
        const { player } = client.queue.get(message.guild?.id);
        const embed = new MessageEmbed().setColor("#554b58");

        if (player.isNightcore) {
            player.reset();
            embed.setDescription("Nightcore Deactivated");
            await message.reply({ embeds: [embed] });
            return;
        }

        player.reset();
        player.setNightcore();
        embed.setDescription("Nightcore Activated");
        await message.reply({ embeds: [embed] });
    }
};
