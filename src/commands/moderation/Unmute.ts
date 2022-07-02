import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CheckPermsBoth } from "../../utils/functions/mod";
import {
    CommandInteraction,
    GuildMember,
    GuildMemberRoleManager,
} from "discord.js";

const ModUnmute: CommandInt = {
    name: "mod unmute",
    description: "Unmutes a user",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!(await CheckPermsBoth(interaction, "MODERATE_MEMBERS"))) {
            return;
        }
        let data = interaction.options.getMember("user", true) as GuildMember;
        if (data.id == client.user?.id) {
            await interaction.followUp({
                content: "I can't moderate myself",
            });
            return;
        }
        let member = await interaction.guild?.members.fetch(data.id);
        if (member == null) {
            await interaction.followUp({
                content: "Cannot find user",
            });
            return;
        }
        if (
            !member.moderatable ||
            member.roles.highest.position >=
                (interaction.member?.roles as GuildMemberRoleManager).highest
                    .position
        ) {
            await interaction.followUp({
                content: "Cannot moderate user",
            });
            return;
        }
        try {
            await member.timeout(0, `Unmuted by ${interaction.user.tag}`);
        } catch {
            await interaction.followUp({
                content: `Failed to unmute member ${member}`,
            });
        }
        await interaction.followUp({
            content: `${member} was unmuted`,
        });
        return;
    },
};

export default ModUnmute;