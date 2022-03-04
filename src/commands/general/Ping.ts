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
        super("ping", "Returns Ping");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const msg = (await interaction.followUp({
            content: `Ponging...`,
        })) as Message;
        const embed = new MessageEmbed()
            .setColor((interaction.member as GuildMember).displayColor)
            .setDescription(
                `**Shard:** ${
                    interaction.guild?.shardId
                }\n**Socket:** ${client.ws.ping.toFixed(2)}ms\n**Latency:** ${(
                    msg.createdTimestamp - interaction.createdTimestamp
                ).toFixed(2)}ms`
            )
            .setTimestamp();
        await msg.edit({
            content: null,
            embeds: [embed],
        });
        return;
    }
}
