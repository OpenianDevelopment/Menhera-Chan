import BaseInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";

export default class UptimeCommand extends BaseInt {
    constructor() {
        super("uptime", "Return bot's ready Date/timer");
    }
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        const time = (Date.now() - client.uptime!).toString().slice(0, -3);
        const embed = new MessageEmbed()
            .setColor((interaction.member as GuildMember).displayColor)
            .setDescription(
                `**Shard:** ${interaction.guild?.shardId}\n**Started:** <t:${time}> (<t:${time}:R>)`
            )
            .setTimestamp();
        await interaction.followUp({
            embeds: [embed],
        });
        return;
    }
}
