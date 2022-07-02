import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    CommandInteraction,
    GuildMember,
    Message,
    MessageEmbed,
} from "discord.js";

const Ping: CommandInt = {
    name: "ping",
    description: "Returns Ping",
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const msg = (await interaction.followUp({
            content: `Ponging...`,
        })) as Message;
        const embed = new MessageEmbed()
            .setColor((interaction.member as GuildMember).displayColor)
            .setDescription(
                `**Shard:** ${interaction.guild?.shardId}\n**Socket:** ${
                    client.ws.ping
                }ms\n**Latency:** ${
                    msg.createdTimestamp - interaction.createdTimestamp
                }ms`
            )
            .setTimestamp();
        await msg.edit({
            content: null,
            embeds: [embed],
        });
        return;
    },
};

export default Ping;
