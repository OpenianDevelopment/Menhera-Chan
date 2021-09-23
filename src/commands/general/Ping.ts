import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";

export default class PingCommand extends BaseCommand {
    constructor() {
        super("ping", "Returns Ping");
    }
    async run(
        client: DiscordClient,
        interaction: CommandInteraction,
        args: string[]
    ) {
        interaction.reply({ content: "Pong" });
    }
}
