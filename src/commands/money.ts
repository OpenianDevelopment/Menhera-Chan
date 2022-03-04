import BaseCommand from "../structures/BaseCommand";
import DiscordClient from "../client/client";
import { addBalance } from "../database/functions/EconFunctions";
import { CommandInteraction } from "discord.js";

export default class MoneyCommand extends BaseCommand {
    constructor() {
        super("money", "developer debug to give money");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        interaction.followUp({
            content: `100000 coins have been deposited to your account`,
        });
        addBalance(interaction.user.id, 100000);
    }
}
