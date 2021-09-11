import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";
import chalk from "chalk";

export default class PingCommand extends BaseCommand {
    constructor() {
        super("ping", "Returns Ping");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        interaction
            .reply({ content: "Pong" })
            .catch((err: Error) =>
                console.log(chalk.red("Interaction Failed in Ping Event"), err)
            );
    }
}
