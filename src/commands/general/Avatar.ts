import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction, GuildMember } from "discord.js";
import { CustomEmbed } from "../../utils/functions/Custom";

const Avatar: CommandInt = {
    name: "avatar",
    description: "To get avatar",
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const member =
            (interaction.options.getMember("user") as GuildMember) ||
            (interaction.member as GuildMember);

        const embed = new CustomEmbed(interaction)
            .setDescription(
                (member.avatar
                    ? `[Server Avatar](${member.displayAvatarURL({
                          dynamic: true,
                      })})\n`
                    : "") + "Main Avatar:"
            )
            .setImage(
                member.user.displayAvatarURL({
                    dynamic: true,
                    size: 512,
                })
            )
            .setTimestamp();
        await interaction.followUp({ embeds: [embed] });
    },
};

export default Avatar;
