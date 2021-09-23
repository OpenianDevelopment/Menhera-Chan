import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";

export default class AvatarCommand extends BaseCommand {
    constructor() {
        super("avatar", "To get avatar");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const member =
            (interaction.options.getMember("user") as GuildMember) ||
            (interaction.member as GuildMember);

        const embed = new MessageEmbed()
            .setColor(member.displayHexColor)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter(
                "https://menhera.openian.dev",
                client.user!.displayAvatarURL({ dynamic: true })
            )
            .setTimestamp();
        await interaction.followUp({ embeds: [embed], ephemeral: false });
    }
}
