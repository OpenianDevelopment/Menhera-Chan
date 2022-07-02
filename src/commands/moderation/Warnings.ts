import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CheckPermsBoth } from "../../utils/functions/mod";
import { CommandInteraction, MessageEmbed } from "discord.js";
import config from "../../utils/config";
import { getUserWarnings } from "../../database/functions/WarnsFunctions";

const ModWarnings: CommandInt = {
    name: "mod warnings",
    description: "Get warnings of a user",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!(await CheckPermsBoth(interaction, "MANAGE_MESSAGES"))) {
            return;
        }
        const member = interaction.options.getMember("user", true);
        const warnings = await getUserWarnings(
            interaction.guild.id,
            member.user.id
        );
        if (!warnings) {
            await interaction.followUp({ content: "User has no warns!" });
            return;
        }
        try {
            let description: string = "";
            warnings.forEach((warn) => {
                const warndate = warn.date;
                description += `**${warn.id} | Moderator: <@${warn.mod}>**\n\t${
                    warn.reason
                } - <t:${warndate.substring(0, warndate.length - 3)}:F>\n\n`;
                return description;
            });
            const WarnEmbed = new MessageEmbed()
                .setAuthor({
                    name: `${member.user.username} has ${
                        description ? warnings.length : "0"
                    } warns logged`,
                    iconURL: member.user.displayAvatarURL(),
                })
                .setDescription(description || "No Warnings")
                .setColor(member.displayColor)
                .setTimestamp();
            interaction.followUp({ embeds: [WarnEmbed] });
            return;
        } catch {
            await interaction.followUp({
                content: `${config.emojis.redCrossMark} Command errored out`,
            });
            return;
        }
    },
};

export default ModWarnings;
