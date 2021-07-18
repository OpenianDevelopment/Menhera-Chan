import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";

export default class VoteCommand extends BaseCommand {
    constructor() {
        super("vote", "votes for our bot", "info", [], "vote", "vote");
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        const embed = new MessageEmbed()
            .setAuthor(
                client.user!.username,
                client.user!.displayAvatarURL(),
                "https://menhera-chan.in/"
            )
            .setDescription(
                "You can vote every 12 hours at https://top.gg/bot/731143954032230453"
            );
        message.reply({ embeds: [embed] });
    }
}
