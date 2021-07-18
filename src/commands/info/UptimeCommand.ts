import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { BaseCommand } from "../../utils/structures";

export default class UptimeCommand extends BaseCommand {
    constructor() {
        super(
            "uptime",
            "For the bot's up-time",
            "info",
            ["up"],
            "uptime",
            "uptime"
        );
    }
    async run(client: DiscordClient, message: Message, args: Array<string>) {
        const moment = require("moment");
        require("moment-duration-format");

        const mdf = moment
            .duration(client.uptime)
            .format(`d [Day], h [Hour], m [Minutes], s [Seconds]`);

        message.reply({ content: `Helping you for: \`\`\`nim\n${mdf}\`\`\`` });
    }
}
