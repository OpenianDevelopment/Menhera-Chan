import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";

export default class UptimeCommand extends BaseCommand {
    constructor() {
        super("uptime", "Return bot's ready Date/timer");
    }
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        const time = (Date.now() - client.uptime!).toString();
        const embed = new MessageEmbed()
            .setColor((interaction.member as GuildMember).displayColor)
            .setDescription(
                `**Shard:** ${
                    interaction.guild?.shardId
                }\n**Started:** <t:${time.substring(0, time.length - 3)}:R>`
            )
            .setTimestamp();
        await interaction.followUp({
            embeds: [embed],
        });
        return;
    }
}
