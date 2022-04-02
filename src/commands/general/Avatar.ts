import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, GuildMember } from "discord.js";
import config from "../../utils/config";
import { CustomEmbed } from "../../utils/functions/Custom";

export default class AvatarCommand extends BaseCommand {
    constructor() {
        super("avatar", "To get avatar");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const member =
            (interaction.options.getMember("user") as GuildMember) ||
            (interaction.member as GuildMember);

        const embed = new CustomEmbed(interaction)
            .setImage(
                member.user.displayAvatarURL({
                    dynamic: true,
                    size: 1024,
                    format: "gif",
                })
            )
            .setTimestamp();
        await interaction.followUp({ embeds: [embed] });
    }
}
