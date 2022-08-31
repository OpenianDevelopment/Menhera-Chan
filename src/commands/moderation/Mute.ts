import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CheckPermsBoth } from "../../utils/functions/mod";
import {
    CommandInteraction,
    GuildMember,
    GuildMemberRoleManager,
} from "discord.js";
import ms from "ms";

const ModMute: CommandInt = {
    name: "mod mute",
    description: "mutes a user",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!(await CheckPermsBoth(interaction, "MODERATE_MEMBERS"))) {
            return;
        }
        let data = interaction.options.getMember("user", true) as GuildMember;
        const time = ms(interaction.options.getString("time", true));
        const reason = interaction.options.getString("reason", false);
        if (data.id == client.user?.id) {
            await interaction.reply({
                content: "I can't moderate myself",
                ephemeral: true
            });
            return;
        }
        let member = await interaction.guild?.members.fetch(data.id);
        if (member == null) {
            await interaction.reply({
                content: "Cannot find user",
                ephemeral: true
            });
            return;
        }
        if (
            !member.moderatable ||
            member.roles.highest.position >=
                (interaction.member?.roles as GuildMemberRoleManager).highest
                    .position
        ) {
            await interaction.reply({
                content: "Cannot moderate user",
                ephemeral: true
            });
            return;
        }
        try {
            await member.timeout(
                time,
                `Muted by ${interaction.user.tag}\nreason: ${
                    reason ? reason : "No Reason"
                }`
            );
        } catch {
            await interaction.reply({
                content: `Failed to mute member ${member}`,
                ephemeral: true
            });
        }
        await interaction.reply({
            content: `${member} was muted`,
        });
        return;
    },
};

export default ModMute;