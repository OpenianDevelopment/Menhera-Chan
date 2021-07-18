import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermission } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
export default class RemoveCommand extends BaseCommand {
    constructor() {
        super(
            "remove",
            "Remove song(s) from the queue",
            "music",
            [],
            "remove <song number | song range>",
            "remove 3 or remove 3 6"
        );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!(await checkMusicPermission(client, message))) return;
        const { player } = client.queue.get(message.guild?.id);

        if (args.length === 2) {
            if (isNaN(Number(args[0])) || isNaN(Number(args[1]))) {
                const embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                        "The provided song number(s) should be an natural number"
                    );
                await message.reply({ embeds: [embed] });
                return;
            }

            if (args[0] > args[1]) {
                const embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                        "The provided song number(s) should be in ascending order"
                    );
                await message.reply({ embeds: [embed] });
                return;
            }
            player.queue.remove(args[0], args[1]);
            const embed = new MessageEmbed()
                .setColor("#554b58")
                .setDescription(`Removed from ${args[0]} to ${args[1]}`);
            await message.reply({ embeds: [embed] });
        } else {
            if (isNaN(Number(args[0]))) {
                await message.reply("Invalid Value");
                return;
            }

            player.queue.remove(args[0]);

            const embed = new MessageEmbed()
                .setColor("#554b58")
                .setDescription(`Removed ${args[0]}`);
            await message.reply({ embeds: [embed] });
        }
    }
}
