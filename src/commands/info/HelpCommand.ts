import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";

export default class HelpCommand extends BaseCommand {
    constructor() {
        super("help", "Help Command", "info", ["h"], "help", "help");
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        const embed = new MessageEmbed()
            .setTitle(message.guild!.name)
            .addField(
                `Dashboard`,
                `[Click Here](https://dashboard.menhera-chan.in/)`
            )
            .addField(
                `Command List`,
                `[Click Here](https://www.menhera-chan.in/commands)`
            )
            .addField(
                `Support`,
                `[Click Here](https://www.menhera-chan.in/support)`
            );
        message.reply({ embeds: [embed] });
    }
}
