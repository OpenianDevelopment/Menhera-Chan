import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";

export default class InviteCommand extends BaseCommand {
    constructor() {
        super(
            "invitebot",
            "Invite link to add the bot in your server",
            "info",
            ["invite"],
            "invite",
            "invite"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        const embed = new MessageEmbed()
            .setTitle(`${client.user!.username}'s invite link`)
            .setDescription(`\[Press Here\]\(https://menhera-chan.in/invite\)`);
        message.reply({ embeds: [embed] });
    }
}
