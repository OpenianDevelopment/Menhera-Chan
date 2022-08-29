import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";

const Uptime: CommandInt = {
    name: "uptime",
    description: "Return bot's ready Date/timer",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        const time = (Date.now() - client.uptime!).toString().slice(0, -3);
        const embed = new MessageEmbed()
            .setColor((interaction.member as GuildMember).displayColor)
            .setDescription(
                `**Shard Id:** ${interaction.guild?.shardId}\n**Online Since:** <t:${time}> (<t:${time}:R>)`
            )
            .setTimestamp();
        await interaction.reply({
            embeds: [embed],
        });
        return;
    },
};

export default Uptime;
