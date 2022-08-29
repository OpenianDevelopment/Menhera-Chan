import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";
import { UpdateInviteLog } from "../../database/functions/GuildSettingsFunctions";
import { CheckPerms } from "../../utils/functions/mod";
import { CustomEmbed } from "../../utils/functions/Custom";
import { updateCacheGuildSettings } from "../../utils/initialFunctions";

const SettingsStarBoardChannel: CommandInt = {
    name: "settings invitelog",
    description: "Change invitelog channel",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (
            !(await CheckPerms(
                interaction,
                interaction.user.id,
                "ADMINISTRATOR"
            ))
        ) {
            return;
        }
        const oldData = client.guildSettings.get(interaction.guildId);
        if (!oldData)
            return interaction.reply({
                content: "Guild has no settings cached",
            });
        const channel = interaction.options.getChannel("channel", true);
        UpdateInviteLog(interaction.guildId, { channelId: channel.id });
        const embed = new CustomEmbed(interaction, false, false).setDescription(
            `Invite Log Channel is now set to <#${channel.id}>`
        );
        await updateCacheGuildSettings(client, interaction.guildId);
        return interaction.reply({ embeds: [embed] });
    },
};

export default SettingsStarBoardChannel;
