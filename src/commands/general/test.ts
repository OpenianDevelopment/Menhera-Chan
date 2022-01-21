import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    CommandInteraction,
    GuildMember,
    Message,
    MessageEmbed,
} from "discord.js";

export default class PingCommand extends BaseCommand {
    constructor() {
        super("test", "test");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const msg = (await interaction.followUp({
            content: `test`,
        }))
        interaction.deleteReply()
    }
}
