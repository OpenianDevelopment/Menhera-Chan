import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";
export default class PurgeCommand extends BaseCommand {
    constructor() {
        super(
            "purge",
            "purge message",
            "moderation",
            [],
            "purge [amount of message]",
            "purge 50"
        );
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (message.channel.type === "dm") return;
        if (!message.member?.permissions.has("MANAGE_MESSAGES")) return;
        if (!message.guild?.me?.permissions.has("MANAGE_MESSAGES")) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ I don't have `Manage Messages` Permission");
            await message.reply({ embeds: [embed] });
            return;
        }
        if (!args.length || isNaN(Number(args[0]))) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                    "❌ You need to provide the number of message to delete"
                );
            await message.reply({ embeds: [embed] });
            return;
        }
        await message.channel.bulkDelete(Number(args[0]), true);
    }
}
