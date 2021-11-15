import BaseCommand from "../structures/BaseCommand";
import DiscordClient from "../client/client";
import { CommandInteraction, GuildMember, MessageEmbed, AwaitMessagesOptions } from "discord.js";
import config from "../utils/config";

export default class SuCommand extends BaseCommand {
    constructor() {
        super("superuser", "Enters ultra-dev mode");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const embed = new MessageEmbed().setColor(
            (interaction.member as GuildMember).displayColor
        );
        if (!config.root.includes(interaction.user.id)) {
            interaction.followUp({ embeds: [embed.setDescription("❌ | Access denied")] });
            return;
        }
        interaction.followUp({ embeds: [embed.setDescription("✔️ | The session has started")] });
        const dmcollector = await interaction.user.dmChannel?.awaitMessages({max: 1});
    }
}
