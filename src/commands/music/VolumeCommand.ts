import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { checkMusicPermission } from "../../utils/functions/musicFunctions";
import { BaseCommand } from "../../utils/structures";
export default class VolumeCommand extends BaseCommand {
    constructor() {
        super(
            "volume",
            "Change volume",
            "music",
            ["v"],
            "volume <Volume %>",
            "volume 50"
        );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!(await checkMusicPermission(client, message))) return;
        if (!args.length || isNaN(Number(args[0]))) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ Volume should be a number");
            await message.reply({
                embeds: [embed],
            });
            return;
        }
        const embed = new MessageEmbed()
            .setColor("#554b58")
            .setDescription(`Volume set to ${args[0]}`);
        const { player } = client.queue.get(message.guild?.id);
        player.setVolume(args[0]);
        await message.reply({ embeds: [embed] });
    }
}
