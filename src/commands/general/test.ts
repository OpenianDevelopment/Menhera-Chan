import BaseInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";

export default class PingCommand extends BaseInt {
    constructor() {
        super("test", "test");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        interaction.followUp({
            content: `test`,
        });
        setTimeout(() => {
            interaction.deleteReply();
        }, 5000);
        return;
    }
}
