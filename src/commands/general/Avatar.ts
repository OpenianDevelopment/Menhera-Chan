import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import config from "../../utils/config";

export default class AvatarCommand extends BaseCommand {
    constructor() {
        super("avatar", "To get avatar");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const member =
            (interaction.options.getMember("user") as GuildMember) ||
            (interaction.member as GuildMember);

        const embed = new MessageEmbed()
            .setColor((interaction.member as GuildMember).displayColor)
            .setImage(
                member.user.displayAvatarURL({ dynamic: true, size: 1024 })
            )
            .setFooter({
                iconURL:client.user!.displayAvatarURL({ dynamic: true }),
                text:config.links.website
            })
            .setTimestamp();
        await interaction.followUp({ embeds: [embed] });
    }
}
